import React, { useEffect, useState } from "react";
import { getClaims } from "../api";
import ClaimCard from "../components/ClaimCard";

export default function Dashboard({ token }) {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    if (token) {
      getClaims(token).then(res => setClaims(res.data || []));
    }
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Claims</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {claims.map(c => (
          <ClaimCard key={c.claim_id} claim={c} />
        ))}
      </div>
    </div>
  );
}
