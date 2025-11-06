Configuration Management Plan — docs/config-management.md

Summary:
Repo structure & branches: main protected; develop for integration; feature branches feature/*. PRs required with 1 approval.

CI: GitHub Actions runs tests on PRs. Merge only if CI passes and at least one review.
Secrets: Stored in GitHub Secrets; not in repo. Use AWS Secrets Manager for production credentials.
Infrastructure: Terraform stored in infra/ repo folder. State in S3 with DynamoDB lock.
Versioning: Semantic versioning for releases (vMAJOR.MINOR.PATCH). Tagging in Git.
Migrations: Alembic or SQLModel create_all for dev. Migration scripts for prod in migrations/.
Artifacts: Docker images pushed to ECR with tags :main-<sha> and release tags.
Rollback: Automated rollback strategy via ArgoCD or Helm rollback if deploy health-check fails.