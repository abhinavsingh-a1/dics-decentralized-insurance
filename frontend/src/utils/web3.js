import { ethers } from "ethers";
import IInsurance from "../contracts/IInsurance.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const getContract = (provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, IInsurance.abi, provider);
};

export const submitClaimOnChain = async (signer, claimId, amount) => {
  const contract = getContract(signer);
  const tx = await contract.submitClaim(claimId, ethers.parseEther(amount.toString()));
  await tx.wait();
  return tx.hash;
};
