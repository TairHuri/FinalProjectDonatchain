import { ethers } from "ethers";
import hubAbi from '../abi/Donatchain.json';

import { useAccount, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther, type Abi } from 'viem';
import hubAbiJson from '../abi/Donatchain.json';
// Contract address from environment variables
const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
// Expected chain ID (Sepolia)
const TARGET_CHAIN_ID = BigInt(import.meta.env.VITE_CHAIN_ID ?? "11155111"); // Sepolia

// Static Sepolia configuration used for wallet switching
const SEPOLIA = {
  chainIdDec: 11155111n,
  chainIdHex: '0xaa36a7',
  rpcUrls: ['https://rpc.sepolia.org'],
  chainName: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

/**
 * Ensures the user's wallet is connected to the Sepolia network.
 * If not, attempts to switch or add the chain to the wallet.
 */
async function ensureSepolia() {
  if (!window.ethereum) throw new Error('No injected wallet');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const net = await provider.getNetwork();
  if (net.chainId === SEPOLIA.chainIdDec) return provider;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA.chainIdHex }],
    });
  } catch (err: any) {
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: SEPOLIA.chainIdHex,
          chainName: SEPOLIA.chainName,
          rpcUrls: SEPOLIA.rpcUrls,
          nativeCurrency: SEPOLIA.nativeCurrency,
          blockExplorerUrls: SEPOLIA.blockExplorerUrls,
        }],
      });
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA.chainIdHex }],
      });
    } else {
      throw err;
    }
  }
}

/**
 * Establishes a connection to the smart contract via MetaMask.
 * Ensures the wallet is on Sepolia and returns the contract instance.
 */
const setupHubConnection = async () => {
  if (!window.ethereum) { throw new Error("לא נמצא ארנק בדפדפן (MetaMask)." ) }
  await ensureSepolia();
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (network.chainId !== TARGET_CHAIN_ID) { throw new Error("נא לעבור לרשת Sepolia בארנק." ) }
  const signer = await provider.getSigner();
  const hub = new ethers.Contract(CONTRACT, hubAbi.abi as any, signer);
  if(!hub)throw new Error("נא לעבור לרשת Sepolia בארנק." ) 
  return hub
}

/**
 * Creates a new campaign on-chain.
 * Sends a transaction to the smart contract and extracts the new campaign ID.
 */
export async function createCampaignOnChain(opts: {
  campaignName: string;
  charityId: number;
  startDate: number,
  endDate: number,
  goalAmount: number,
  beneficiary: string;
}): Promise<{ status: true, onchainId: string } | { status: false, message: string }> {
  if (!window.ethereum) { return { status: false, message: "לא נמצא ארנק בדפדפן (MetaMask)." } }
  await ensureSepolia();
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (network.chainId !== TARGET_CHAIN_ID) { return { status: false, message: "נא לעבור לרשת Sepolia בארנק." } }
  const signer = await provider.getSigner();
  const hub = new ethers.Contract(CONTRACT, hubAbi.abi as any, signer);
  const tx = await hub.createCampaign(
    opts.campaignName,
    BigInt(opts.charityId),
    opts.startDate,
    opts.endDate,
    opts.goalAmount,
    opts.beneficiary
  );
  const receipt = await tx.wait();
  const event = receipt.logs
    .map((log: { topics: ReadonlyArray<string>; data: string; }) => { try { return hub.interface.parseLog(log); } catch { return null; } })
    .find((p: { name: string; } | null) => p && (p as any).name === "CampaignCreated");
  const onchainId = (event as any)?.args?.campaignId;
  return { status: true, onchainId };
}

/**
 * Updates an existing on-chain campaign.
 * Sends a transaction and extracts the updated campaign ID from the event logs.
 */
export async function updateCampaignOnChain(opts: {
  blockchainTx: number;
  campaignName: string;
  startDate: number,
  endDate: number,
  goalAmount: number,
}): Promise<{ status: true, onchainId: string } | { status: false, message: string }> {
  if (!window.ethereum) { return { status: false, message: "לא נמצא ארנק בדפדפן (MetaMask)." } }
  await ensureSepolia();
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (network.chainId !== TARGET_CHAIN_ID) { return { status: false, message: "נא לעבור לרשת Sepolia בארנק." } }
  const signer = await provider.getSigner();
  const hub = new ethers.Contract(CONTRACT, hubAbi.abi as any, signer);
  const tx = await hub.updateCampaign(
    opts.blockchainTx,
    opts.campaignName,
    opts.startDate,
    opts.endDate,
    opts.goalAmount,
  );
  const receipt = await tx.wait();
  const event = receipt.logs
    .map((log: { topics: ReadonlyArray<string>; data: string; }) => { try { return hub.interface.parseLog(log); } catch { return null; } })
    .find((p: { name: string; } | null) => p && (p as any).name === "CampaignUpdated");
  const onchainId = (event as any)?.args?.campaignId;
  return { status: true, onchainId };
}

/**
 * Toggles an on-chain campaign's active/inactive status.
 */
export async function toggleCryptoCampaignStatus(opts: {
  blockchainTx: number;
  newActive: boolean;
}): Promise<{ status: true, onchainId: string } | { status: false, message: string }> {
  const hub = await setupHubConnection();  
  const tx = await hub.updateCampaignActive(
    opts.blockchainTx,
    opts.newActive,
  );

  const receipt = await tx.wait();
  const event = receipt.logs
    .map((log: { topics: ReadonlyArray<string>; data: string; }) => { try { return hub.interface.parseLog(log); } catch { return null; } })
    .find((p: { name: string; } | null) => p && (p as any).name === "CampaignStatusChanged");
  const onchainId = (event as any)?.args?.campaignId;
  return { status: true, onchainId };
}


/**
 * Fetches campaign data directly from the blockchain.
 */
export const getCampaignOnChain = async (blockchainTx: number) => {
 const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT, hubAbi.abi, provider);

  const campaignOnChain = await contract.campaigns(blockchainTx);
  return campaignOnChain;
  
}


// ===== Crypto helper functions =====

  const HUB_ABI = hubAbiJson.abi as Abi;

/**
 * Hook that handles crypto donations using Wagmi.
 * Returns donation function + transaction state.
 */
export const useCryptoPayment = () => {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: waiting, isSuccess } = useWaitForTransactionReceipt({ hash });

  async function donateCrypto(amountEth: string, campaignTx:string) {
    if (!isConnected) throw new Error("התחברי לארנק");
    if (chainId !== sepolia.id) return switchChain({ chainId: sepolia.id });

    writeContract({
      address: CONTRACT,
      abi: HUB_ABI,
      functionName: "donateCrypto",
      args: [BigInt(campaignTx)],
      value: parseEther(amountEth || "0.01"),
    });
  }

  return { donateCrypto, waiting, isSuccess, hash, isPending, error };
};