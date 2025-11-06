from pydantic import BaseModel
from typing import Optional, List, Any

class AuthNonceResponse(BaseModel):
    address: str
    nonce: str

class AuthRequest(BaseModel):
    address: str
    signature: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class CreateClaimReq(BaseModel):
    policy_id: int
    amount: float
    merkle_root: str
    documents: Optional[List[dict]] = None  # [{filename,cid,sha256,proof}, ...]

class ClaimResp(BaseModel):
    claim_id: int
    policy_id: int
    claimant_address: str
    amount: float
    merkle_root: str
    status: str
    submitted_at: str
    documents: Optional[List[dict]] = None
