require('dotenv').config();
const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");

const RPC = process.env.RPC_URL || "http://127.0.0.1:8545";
const provider = new ethers.providers.JsonRpcProvider(RPC);

const CONTRACT_ADDR = process.env.CLAIM_REGISTRY_ADDRESS;
const ABI_PATH = process.env.CLAIM_REGISTRY_ABI_PATH || "../smart-contracts/artifacts/contracts/ClaimRegistry.sol/ClaimRegistry.json";
const abi = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

const contract = new ethers.Contract(CONTRACT_ADDR, abi, provider);

contract.on("ClaimSubmitted", async (claimId, policyId, claimant, merkleRoot, amount, ts, event) => {
  console.log("ClaimSubmitted:", claimId.toString(), policyId.toString(), claimant);
  // Push to backend (if backend has an endpoint to accept onchain events)
  try {
    await axios.post(`${process.env.BACKEND_API}/internal/onchain-event`, { event: "ClaimSubmitted", claimId: claimId.toString(), policyId: policyId.toString(), claimant, merkleRoot, amount: amount.toString(), tx: event.transactionHash });
  } catch (e) {
    console.error("Notify backend failed", e.message);
  }
});
