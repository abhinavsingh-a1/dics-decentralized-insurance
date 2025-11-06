import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      p.listAccounts().then(accounts => {
        if (accounts.length > 0) setAccount(accounts[0].address);
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not detected");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const p = new ethers.BrowserProvider(window.ethereum);
    const s = await p.getSigner();
    setProvider(p);
    setSigner(s);
    setAccount(accounts[0]);
  };

  const signMessage = async (message) => {
    if (!signer) throw new Error("Wallet not connected");
    return await signer.signMessage(message);
  };

  return { account, provider, signer, connectWallet, signMessage };
};
