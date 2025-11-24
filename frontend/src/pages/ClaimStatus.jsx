import React, { useState } from "react";
import axios from "axios";

export default function ClaimStatus({ token }) {
  const [id, setId] = useState("");
  const [claim, setClaim] = useState(null);

  async function handleSearch() {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/claims/${id}`, { headers: { Authorization: `Bearer ${token}` }});
    setClaim(res.data);
  }

  return (
    <div className="border p-4">
      <h3 className="font-semibold mb-2">Claim Status</h3>
      <div className="flex gap-2 mb-2">
        <input value={id} onChange={e=>setId(e.target.value)} placeholder="Claim ID" className="p-2 border"/>
        <button onClick={handleSearch} className="bg-blue-600 text-white px-3 py-1 rounded">Search</button>
      </div>
      {claim && (
        <div>
          <p><b>Status:</b> {claim.status}</p>
          <p><b>Amount:</b> €{claim.amount}</p>
          <p><b>Submitted:</b> {claim.submitted_at}</p>
        </div>
      )}
    </div>
  );
}
