from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional, List
from ..schemas import CreateClaimReq, ClaimResp
from ..db import async_session
from ..models import Claim, Document
from sqlalchemy.future import select
from ..auth import get_current_address
from datetime import datetime
import uuid
import json

router = APIRouter(prefix="/claims", tags=["claims"])

async def get_db():
    async with async_session() as session:
        yield session

async def get_current_user(authorization: Optional[str] = Header(None)):
    # very light dependency wrapper
    return await get_current_address(authorization=authorization)

async def get_current_address(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")
    scheme, token = authorization.split()
    from jose import jwt
    payload = jwt.decode(token, os.getenv("SECRET_KEY", "replace_with_secret"), algorithms=[os.getenv("JWT_ALGO","HS256")])
    return payload["sub"]

@router.post("", response_model=ClaimResp, status_code=201)
async def create_claim(payload: CreateClaimReq, authorization: Optional[str] = Header(None), db=Depends(get_db)):
    claimant = await get_current_address(authorization=authorization)
    # persist Claim
    claim = Claim(
        policy_id=payload.policy_id,
        claimant_address=claimant,
        amount=payload.amount,
        merkle_root=payload.merkle_root,
        status="submitted",
    )
    db.add(claim)
    await db.commit()
    await db.refresh(claim)

    # store document metadata if provided (docs are expected already uploaded to IPFS/S3)
    docs = []
    if payload.documents:
        for d in payload.documents:
            doc_id = uuid.uuid4().hex
            doc = Document(
                doc_id=doc_id,
                claim_id=claim.claim_id,
                filename=d.get("filename"),
                file_cid=d.get("cid"),
                sha256_hash=d.get("sha256"),
                merkle_proof=d.get("proof"),
                uploaded_by=claimant
            )
            db.add(doc)
            docs.append({"doc_id": doc_id, "cid": d.get("cid")})
        await db.commit()

    return {
        "claim_id": claim.claim_id,
        "policy_id": claim.policy_id,
        "claimant_address": claim.claimant_address,
        "amount": claim.amount,
        "merkle_root": claim.merkle_root,
        "status": claim.status,
        "submitted_at": claim.submitted_at.isoformat(),
        "documents": payload.documents or []
    }

@router.get("/{claim_id}", response_model=ClaimResp)
async def get_claim(claim_id: int, authorization: Optional[str] = Header(None), db=Depends(get_db)):
    _ = await get_current_address(authorization=authorization)  # ensure auth
    q = await db.execute(select(Claim).where(Claim.claim_id == claim_id))
    claim = q.scalar_one_or_none()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    # get docs
    q2 = await db.execute(select(Document).where(Document.claim_id == claim_id))
    docs = q2.scalars().all()
    docs_out = [{"filename": d.filename, "cid": d.file_cid, "sha256": d.sha256_hash} for d in docs]

    return {
        "claim_id": claim.claim_id,
        "policy_id": claim.policy_id,
        "claimant_address": claim.claimant_address,
        "amount": claim.amount,
        "merkle_root": claim.merkle_root,
        "status": claim.status,
        "submitted_at": claim.submitted_at.isoformat(),
        "documents": docs_out
    }
