import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const RPC = process.env.RPC_URL || "http://localhost:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""; // רק למבחן
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

const provider = new ethers.providers.JsonRpcProvider(RPC);
const wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;
const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../contracts/DonationManager.abi.json")).toString());

export const getContract = () => {
  if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS not set");
  return new ethers.Contract(CONTRACT_ADDRESS, abi, wallet ?? provider);
};

// דוגמא לפונקציה לקריאת קמפיינים
export const getCampaign = async (id: number) => {
  const contract = getContract();
  const camp = await contract.getCampaign(id);
  return camp;
};

// CREATE campaign דרך השרת (אם רוצים שהשרת יחתום)
export const createCampaignOnChain = async (title: string, description: string, targetWei: string) => {
  if (!wallet) throw new Error("Server wallet missing");
  const contract = getContract().connect(wallet);
  const tx = await contract.createCampaign(title, description, targetWei);
  return tx.wait();
};
