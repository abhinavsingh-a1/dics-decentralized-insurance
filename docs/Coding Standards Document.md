Short, practical coding standards covering Solidity, Python, JavaScript, SQL, Terraform and Git.

General

Follow consistent branching: feature/* for dev, release/* for release, main protected
Use descriptive commit messages: type(scope): short description e.g., feat(smart-contracts): add claim struct
1 PR per feature/bug; link to ticket/requirement; request 1+ reviewer

Solidity
Compiler: pragma solidity ^0.8.17;
Use OpenZeppelin libraries for ERCs and AccessControl
Functions: minimal visibility (external/public/internal/private)
Use uint256 everywhere for consistency
Avoid loops on unbounded arrays; favor events & indexing
NatSpec comments for contract & public functions
Tests: use Foundry or Hardhat with >= 80% coverage
Lint: Solhint & Slither for static analysis

Python (FastAPI)
Use Python 3.11+, type hints for functions
Follow PEP8 formatting; use black + ruff for linting
Use dependency injection for DB sessions
Validate input with Pydantic models
Logging: structured JSON logs; sensitive fields redacted
Exceptions: return appropriate HTTP status codes, consistent error schema
Tests: PyTest; test coverage >= 80% for critical modules

JavaScript / TypeScript (Frontend / Scripts)
Prefer TypeScript for frontend and tooling
Lint: ESLint + Prettier; enforce consistent rules
Use ethers.js for blockchain interactions
Keep UI logic separate from blockchain tx building
Unit tests: Jest + React Testing Library

SQL
Use parameterized queries (no string interpolation)
Schema migrations: use Alembic (Python) or Flyway
Naming conventions: snake_case, table names plural
Index commonly queried columns

Terraform
Use modules and logical separation
Pin provider versions
Use terraform fmt and terraform validate
Keep state in remote backend (S3 + DynamoDB lock)
Plan reviewed by CI; apply requires approvals for prod

Docker
Minimal base images, scan images for vulnerabilities
Multi-stage builds for smaller images
Non-root user to run containers

Secrets
Never commit secrets; use environment variables or secrets manager
GitHub Actions: use secrets and environment protections