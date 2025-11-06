# Integration Test Report — Backend (DICS)

Date: 2025-11-06
Executed by: Developer Name

## Environment
- App: backend (FastAPI)
- DB: PostgreSQL 14 (docker-compose) at localhost:5432
- Redis: 7 (docker-compose)
- Storage: IPFS (local) / S3 (staging)
- Test runner: pytest

## Tests run
- Auth: nonce generation, signature verification (requires test key)
- Claims: create claim (with mock document metadata), retrieve claim
- DB persistence: verify claim row and document rows
- Error cases: unauthorized access, missing fields

## Results
- Total tests: X
- Passed: Y
- Failed: Z
- Comments: [areas passed/failed]

## Defects found
- ID: IT-001
  Summary: Signature verification fails when signature generated with different prefix
  Severity: Medium
  Status: Open
  Action: Use EIP-191 formatted message in client library.

## Recommendations
- Add E2E test that includes on-chain tx submission (Hardhat local node)
- Automate integration tests in CI/CD (GitHub Actions) with docker-compose services
