import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import FileClaim from "./pages/FileClaim";
import ClaimStatus from "./pages/ClaimStatus";
import WalletConnectButton from "./components/WalletConnectButton";
import { useWallet } from "./hooks/useWallet";

export default function App() {
  const { account, connectWallet, signMessage } = useWallet();
  const [token, setToken] = useState(null);

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">DICS — Aurelia Labs</h1>
        <WalletConnectButton account={account} connectWallet={connectWallet} />
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <Dashboard token={token} />
            <FileClaim token={token} setToken={setToken} />
            <ClaimStatus token={token} />
          </div>
        </div>
      </main>
    </div>
  );
}