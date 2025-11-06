from fastapi import APIRouter, Body, HTTPException
from ..auth import generate_nonce, verify_signature, create_access_token
from ..schemas import AuthNonceResponse, AuthRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/nonce", response_model=AuthNonceResponse)
async def get_nonce(address: str):
    nonce = await generate_nonce(address)
    return {"address": address, "nonce": nonce}

@router.post("/wallet", response_model=TokenResponse)
async def login_wallet(payload: AuthRequest):
    ok = await verify_signature(payload.address, payload.signature)
    if not ok:
        raise HTTPException(status_code=401, detail="Invalid signature or nonce expired.")
    token = create_access_token(payload.address)
    return {"access_token": token}
