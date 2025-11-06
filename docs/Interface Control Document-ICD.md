Contents (summary):
Purpose: Define interface contracts between Frontend, Backend, Blockchain, and Storage.
Frontend ↔ Backend (REST):
/auth/nonce?address={address} GET → returns {address, nonce}
/auth/wallet POST {address, signature} → returns {access_token}
/claims POST {policy_id, amount, merkle_root, documents[]} (Bearer token)
/claims/{id} GET (Bearer token)
Error codes documented (401, 404, 400)

Backend ↔ Blockchain:
Backend stores claim metadata and returns onchain_claim_id when the frontend creates on-chain tx.
Events: ClaimSubmitted, ClaimStatusChanged, ClaimPayout to be consumed by indexer.

Backend ↔ IPFS/S3:
Client uploads then sends cid to backend OR backend uploads and returns cid, sha256.

Security: JWT for backend APIs, EIP-712/EIP-191 for signature standardization.
(Full ICD file should include message formats, examples, error response schemas, rate limits, and versioning policy.)