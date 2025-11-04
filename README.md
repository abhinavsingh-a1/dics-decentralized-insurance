# 🪙 Decentralized Insurance Claim Settlement (DICS)

## Overview
**DICS** is a blockchain-based insurance platform that automates claim submission, validation, and settlement using **smart contracts** on the **Ethereum Virtual Machine (EVM)**.  
It ensures transparency, security, and fraud prevention through decentralized technologies.

---

## 🧭 Project Objectives
- Enable trustless claim settlement between insurer and user.  
- Automate claim validation using oracles (e.g., weather, flight).  
- Store and verify documents securely using IPFS and Merkle proofs.  
- Provide real-time monitoring using Prometheus and Grafana.  
- Deploy securely on AWS using Terraform + Kubernetes + GitOps.

---

## 🏗️ System Architecture
**Core Components:**
- **Frontend:** React.js + MetaMask integration  
- **Backend:** FastAPI (Python) + PostgreSQL + Redis  
- **Blockchain:** Solidity Smart Contracts (Hardhat / Foundry)  
- **Storage:** IPFS / AWS S3 for off-chain documents  
- **Infra:** AWS EKS + Terraform + ArgoCD  
- **Monitoring:** Prometheus, Grafana, OpenTelemetry  

---

## 🧩 Folder Structure

├── backend/ → FastAPI backend
 ├── frontend/ → React frontend
 ├── smart-contracts/ → Solidity contracts
 ├── infra/ → Terraform + K8s manifests
 ├── docs/ → CMMI project documents
 ├── .github/ → CI/CD pipelines
 └── README.md

---

## ⚙️ Tech Stack
| Layer | Technology |
|-------|-------------|
| **Smart Contracts** | Solidity, Hardhat, Ethers.js |
| **Backend** | FastAPI, PostgreSQL, Redis |
| **Frontend** | React.js, Web3.js / Ethers.js |
| **DevOps** | Docker, Kubernetes, Terraform, GitHub Actions |
| **Monitoring** | Prometheus, Grafana, OpenTelemetry |
| **Security** | ECDSA, Schnorr Signatures, Merkle Trees |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- Docker
- MetaMask Wallet (for testing)
- AWS Account (for infra setup)

### Clone the Repository
```bash
git clone https://github.com/<your-username>/dics-decentralized-insurance.git
cd dics-decentralized-insurance

Setup Smart Contracts
cd smart-contracts
npm install
npx hardhat compile
npx hardhat test

Run Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Run Frontend
cd frontend
npm install
npm start

🧪 Testing Strategy
Smart Contracts: Unit testing via Hardhat and Foundry.
Backend: PyTest + Mock API calls.
Frontend: React Testing Library.
Integration: Testnet deployment on Ethereum Sepolia.

🧰 CI/CD
GitHub Actions for build/test pipelines.
Terraform + ArgoCD for AWS infrastructure automation.
Grafana Dashboards for runtime observability.

🧾 Documentation
All documents under /docs:
ProjectCharter.md
SRS.md
RiskRegister.md
Architecture.md

🧑‍💻 Contributing
Fork the repository.

Create your feature branch:
 git checkout -b feature/claim-api

Commit your changes:
 git commit -m "Added claim submission API"

Push to the branch:
 git push origin feature/claim-api

Create a Pull Request.

🧩 License
This project is licensed under the MIT License.

📧 Contact
Project Manager: Abhinav Singh
 Email: a1.abhinavsingh@gmail.com