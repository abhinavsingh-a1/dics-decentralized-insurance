import React, { useState } from "react";
import { createClaim, getNonce, loginWallet } from "../api";
import { useWallet } from "../hooks/useWallet";
import axios from "axios";

export default function FileClaim({ token, setToken }) {

  const handleSubmit = async (e) => {
    const { account, signMessage } = useWallet();
  const [policyId, setPolicyId] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!account) return alert("Connect wallet first");

    // Get nonce
    const nonceResp = await axios.get(`${import.meta.env.VITE_API_URL}/auth/nonce`, { params: { address: account }});
    const nonce = nonceResp.data.nonce;
    const message = `Aurelia Labs login nonce: ${nonce}`;
    const signature = await signMessage(message);

    const tokenResp = await axios.post(`${import.meta.env.VITE_API_URL}/auth/wallet`, { address: account, signature });
    setToken(tokenResp.data.access_token);

    // For demo, we assume file uploaded to IPFS already and we have a cid
    const cid = "bafybeiexamplecid";
    const body = { policy_id: Number(policyId), amount: Number(amount), merkle_root: "0x" + Math.random().toString(16).slice(2,66), documents: [{filename: file?.name ?? "doc", cid, sha256: "sha256"}] };
    await axios.post(`${import.meta.env.VITE_API_URL}/claims`, body, { headers: { Authorization: `Bearer ${tokenResp.data.access_token}` }});
    alert("Claim created");
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 mb-6">
      <h3 className="font-semibold mb-2">File a New Claim</h3>
      <input placeholder="Policy ID" value={policyId} onChange={e=>setPolicyId(e.target.value)} className="block mb-2 p-2 border"/>
      <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} className="block mb-2 p-2 border"/>
      <input type="file" onChange={e=>setFile(e.target.files[0])} className="block mb-2" />
      <button className="bg-green-600 text-white px-3 py-1 rounded">Submit Claim</button>
    </form>
  );
}
}
