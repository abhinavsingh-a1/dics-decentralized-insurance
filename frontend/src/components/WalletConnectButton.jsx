import React from "react";

export default function WalletConnectButton({ account, connectWallet }) {
  return (
    <button onClick={connectWallet} className="bg-indigo-600 text-white px-3 py-1 rounded">
      {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}
    </button>
  );
}
