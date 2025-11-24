import React, { useEffect, useState } from "react";
import { getClaims } from "../api";
import ClaimCard from "../components/ClaimCard";
import axios from "axios";

export default function Dashboard({ token }) {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
if (!token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/claims`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setClaims(r.data))
      .catch(() => setClaims([]));
  }, [token]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Claims</h2>
      {claims.length === 0 ? <p>No claims yet</p> :
        <ul>
          {claims.map(c => <li key={c.claim_id} className="border p-2 my-1">{c.claim_id} - {c.status} - €{c.amount}</li>)}
        </ul>
      }
    </div>
  );
}
