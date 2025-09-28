import React, { useState } from "react";
import { ethers } from "ethers";

export default function WalletConnector() {
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    if (!(window as any).ethereum) return alert("Please install MetaMask");
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
  };

  return (
    <div>
      {account ? <span>{account}</span> : <button onClick={connect}>Connect Wallet</button>}
    </div>
  );
}
