from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class Policy(SQLModel, table=True):
    policy_id: int = Field(primary_key=True)
    contract_address: Optional[str] = None
    holder_address: Optional[str] = None
    coverage: Optional[dict] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Claim(SQLModel, table=True):
    claim_id: Optional[int] = Field(default=None, primary_key=True)
    policy_id: int
    onchain_claim_id: Optional[int] = None
    claimant_address: str
    amount: float = 0.0
    merkle_root: str
    status: str = "submitted"
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    tx_hash: Optional[str] = None
    metadata: Optional[dict] = None

class Document(SQLModel, table=True):
    doc_id: Optional[str] = Field(default=None, primary_key=True)
    claim_id: Optional[int] = Field(default=None, foreign_key="claim.claim_id")
    filename: Optional[str] = None
    file_cid: Optional[str] = None
    sha256_hash: Optional[str] = None
    merkle_proof: Optional[dict] = None
    uploaded_by: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
