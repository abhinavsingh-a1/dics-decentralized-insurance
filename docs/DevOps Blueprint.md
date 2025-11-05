Terraform structure (recommended repo infra/terraform)

infra/
└── terraform/
    ├── environments/
    │   ├── dev/
    │   │   ├── main.tf
    │   │   ├── variables.tf
    │   │   └── outputs.tf
    │   └── prod/
    ├── modules/
    │   ├── vpc/
    │   ├── eks/
    │   ├── rds/
    │   ├── ecr/
    │   └── s3/
    ├── provider.tf
    └── versions.tf

Key Terraform modules:

vpc — VPC, subnets, NAT, route tables
eks — EKS cluster, node groups, IAM roles
rds — RDS Postgres (multi-AZ for prod)
ecr — Docker repo for images
s3 — off-chain storage fallback + backend state

Use terraform workspaces for env separation or environments directories

Kubernetes layout (infra/k8s or Helm charts)

charts/backend — backend deployment, service, HPA, configmap, secrets
charts/frontend — frontend deployment, ingress
charts/indexer — indexer deployment
charts/uploadsvc — upload service
charts/observability — Prometheus, Grafana, OpenTelemetry collector

CI/CD pipeline plan (GitHub Actions + ArgoCD)
GitHub Actions workflows:

.github/workflows/ci.yml — run unit tests (smart-contracts, backend, frontend), build artifacts.
.github/workflows/docker-build-push.yml — build Docker images and push to AWS ECR on main or release/* tags.
.github/workflows/terraform-plan-apply.yml (protected to run via GitHub environment and approvals) — terraform plan on PR; apply on main with required approval.
.github/workflows/release.yml — tag-based release flow.

CD flow:

Developer opens PR -> CI runs -> tests pass -> require 1 review -> merge to main.
On main, docker-build-push builds images and pushes to ECR.
ArgoCD monitors Helm Chart repo or infra/k8s and auto-syncs to cluster (or require manual promotion for prod).
Use ArgoCD ApplicationSets for multiple environments.

Secrets & IAM

Use AWS Secrets Manager or SSM Parameter Store for DB passwords and API keys.
Use IRSA (IAM Roles for Service Accounts) for EKS pods to access AWS resources securely.

Observability & Alerts

Export Prometheus metrics from backend and indexer.
Grafana dashboards pre-built for claim pipeline, ingestion lag, oracle latency, and cost metrics.

Alertmanager rules: Indexer lag > X blocks, failed payouts > threshold, node memory high.