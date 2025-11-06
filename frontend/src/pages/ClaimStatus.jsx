import React, { useState } from "react";
import { getClaimById } from "../api";

export default function ClaimStatus({ token }) {
  const [id, setId] = useState("");
  const [claim, setClaim] = useState(null);

  const handleSearch = async () => {
    const res = await getClaimById(token, id);
    setClaim(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Claim Status</h2>
      <input placeholder="Enter Claim ID" className="border p-2" value={id} onChange={e=>setId(e.target.value)} />
      <button onClick={handleSearch} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded">Search</button>

      {claim && (
        <div className="mt-4 border p-3 rounded bg-gray-50">
          <p><b>Status:</b> {claim.status}</p>
          <p><b>Amount:</b> €{claim.amount}</p>
          <p><b>Submitted At:</b> {new Date(claim.submitted_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
