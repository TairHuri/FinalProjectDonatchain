import { ethers } from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS; // עדיף להשתמש ב-VITE במקום process.env ב-Vite/React
const ABI = [
  // ✨ רק הפונקציות שאת צריכה מתוך ה-ABI של החוזה שלך
  "function donate(uint256 campaignId) public payable",
];

export async function donate(campaignId: number, amountEth: string) {
  if (!(window as any).ethereum) throw new Error("No wallet found, install MetaMask");

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const tx = await contract.donate(campaignId, { value: ethers.parseEther(amountEth) });
  return await tx.wait();
}
