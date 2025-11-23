import { ethers } from "ethers";
import hubAbi from '../abi/Donatchain.json';

import { useAccount, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther, type Abi } from 'viem';
import hubAbiJson from '../abi/Donatchain.json';

const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const TARGET_CHAIN_ID = BigInt(import.meta.env.VITE_CHAIN_ID ?? "11155111"); // Sepolia

const SEPOLIA = {
  chainIdDec: 11155111n,
  chainIdHex: '0xaa36a7',
  rpcUrls: ['https://rpc.sepolia.org'],
  chainName: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};


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
export async function toggleCryptoCampaignsStatus(opts: {
  campaignIds: number[];
  newActive: boolean;
}): Promise<{ status: true, onchainId: string } | { status: false, message: string }> {
  const hub = await setupHubConnection();  
  const tx = await hub.updateManyCampaignsActive(
    opts.campaignIds,
    opts.newActive,
  );

  const receipt = await tx.wait();
  const event = receipt.logs
    .map((log: { topics: ReadonlyArray<string>; data: string; }) => { try { return hub.interface.parseLog(log); } catch { return null; } })
    .find((p: { name: string; } | null) => p && (p as any).name === "ManyCampaignsStatusChanged");
  const onchainId = (event as any)?.args?.campaignId;
  return { status: true, onchainId };
  
}

export const getCampaignOnChain = async (blockchainTx: number) => {
  //const provider = new ethers.JsonRpcProvider(RPC_URL);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT, hubAbi.abi, provider);

  const campaignOnChain = await contract.campaigns(blockchainTx);
  console.log(campaignOnChain);
  return campaignOnChain;
  
}

export // ===== פונקציות עזר לקריפטו =====

  const HUB_ABI = hubAbiJson.abi as Abi;
const CAMPAIGN_ID = Number(import.meta.env.VITE_CAMPAIGN_ID ?? 0);

export const useCryptoPayment = () => {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: waiting, isSuccess } = useWaitForTransactionReceipt({ hash });

  async function donateCrypto(amountEth: string) {
    if (!isConnected) throw new Error("התחברי לארנק");
    if (chainId !== sepolia.id) return switchChain({ chainId: sepolia.id });

    writeContract({
      address: CONTRACT,
      abi: HUB_ABI,
      functionName: "donateCrypto",
      args: [BigInt(CAMPAIGN_ID)],
      value: parseEther(amountEth || "0.01"),
    });
  }

  return { donateCrypto, waiting, isSuccess, hash, isPending, error };
};