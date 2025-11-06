import React, { useState } from "react";
import { createClaim, getNonce, loginWallet } from "../api";
import { useWallet } from "../hooks/useWallet";

export default function FileClaim({ token, setToken }) {
  const { account, signMessage } = useWallet();
  const [policyId, setPolicyId] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return alert("Connect your wallet first");

    const nonceResp = await getNonce(account);
    const signature = await signMessage(`Aurelia Labs login nonce: ${nonceResp.data.nonce}`);
    const tokenResp = await loginWallet({ address: account, signature });
    setToken(tokenResp.data.access_token);

    // Upload to backend
    const formData = new FormData();
    formData.append("policy_id", policyId);
    formData.append("amount", amount);
    formData.append("document", file);

    await createClaim(tokenResp.data.access_token, {
      policy_id: parseInt(policyId),
      amount: parseFloat(amount),
      merkle_root: "0x" + Math.random().toString(16).slice(2, 66),
      documents: [{ filename: file.name, cid: "bafy..." }]
    });

    alert("Claim submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3">
      <h2 className="text-xl font-semibold mb-2">File a New Claim</h2>
      <input placeholder="Policy ID" className="border p-2" value={policyId} onChange={(e)=>setPolicyId(e.target.value)} />
      <input placeholder="Claim Amount (€)" className="border p-2" value={amount} onChange={(e)=>setAmount(e.target.value)} />
      <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
      <button className="bg-green-600 text-white p-2 rounded">Submit Claim</button>
    </form>
  );
}
