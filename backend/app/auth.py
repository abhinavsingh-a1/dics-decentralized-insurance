import os
import time
import secrets
import json
from jose import jwt
from eth_account import Account
from eth_account.messages import encode_defunct
import aioredis
from typing import Optional

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
SECRET_KEY = os.getenv("SECRET_KEY", "replace_with_secret")
JWT_ALGO = os.getenv("JWT_ALGO", "HS256")
JWT_EXP_MINUTES = int(os.getenv("JWT_EXP_MINUTES", "1440"))

# Redis client
_redis = None
async def get_redis():
    global _redis
    if _redis is None:
        _redis = await aioredis.from_url(REDIS_URL, decode_responses=True)
    return _redis

async def generate_nonce(address: str) -> str:
    nonce = secrets.token_hex(16)
    r = await get_redis()
    await r.set(f"nonce:{address.lower()}", nonce, ex=300)  # expires in 5 minutes
    return nonce

async def verify_signature(address: str, signature: str) -> bool:
    r = await get_redis()
    nonce = await r.get(f"nonce:{address.lower()}")
    if not nonce:
        return False
    message = f"Aurelia Labs login nonce: {nonce}"
    encoded = encode_defunct(text=message)
    try:
        recovered = Account.recover_message(encoded, signature=signature)
        return recovered.lower() == address.lower()
    finally:
        # delete nonce on attempt (prevent reuse)
        await r.delete(f"nonce:{address.lower()}")

def create_access_token(address: str) -> str:
    now = int(time.time())
    payload = {"sub": address.lower(), "iat": now, "exp": now + JWT_EXP_MINUTES * 60}
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGO)

# Dependable function for FastAPI dependencies
from fastapi import HTTPException, Depends
from jose import JWTError

async def get_current_address(token: str = Depends(lambda token: None), authorization: Optional[str]=None):
    # Normally use fastapi.security.HTTPBearer; for brevity, accept Authorization header
    if authorization is None:
        raise HTTPException(status_code=401, detail="Missing authorization")
    try:
        scheme, token = authorization.split()
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGO])
        return payload["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
