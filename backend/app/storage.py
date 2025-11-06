import os
from typing import Tuple, Optional
from uuid import uuid4
import hashlib

MODE = os.getenv("STORAGE_MODE", "ipfs")  # "ipfs" or "s3"

# IPFS
IPFS_API_URL = os.getenv("IPFS_API_URL", "http://127.0.0.1:5001")

# S3
import boto3
AWS_REGION = os.getenv("AWS_REGION", "eu-central-1")
S3_BUCKET = os.getenv("S3_BUCKET", "")

def _sha256_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

# IPFS client (optional; requires ipfs daemon or provider)
def upload_to_ipfs(content: bytes, filename: str) -> Tuple[str, str]:
    try:
        import ipfshttpclient
        client = ipfshttpclient.connect(IPFS_API_URL)
        res = client.add_bytes(content)
        # add_bytes returns the CID of raw bytes; to preserve filename use client.add
        return res, _sha256_bytes(content)
    except Exception as e:
        raise RuntimeError("IPFS upload failed: " + str(e))

def upload_to_s3(content: bytes, filename: str) -> Tuple[str, str]:
    s3 = boto3.client("s3", region_name=AWS_REGION)
    key = f"{uuid4().hex}/{filename}"
    s3.put_object(Bucket=S3_BUCKET, Key=key, Body=content)
    url = f"s3://{S3_BUCKET}/{key}"
    return url, _sha256_bytes(content)

def upload_file(content: bytes, filename: str) -> Tuple[str, str]:
    if MODE == "ipfs":
        return upload_to_ipfs(content, filename)
    else:
        return upload_to_s3(content, filename)
