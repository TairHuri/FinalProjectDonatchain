import { config } from '../config';
import { ethers } from 'ethers';
import logger from '../utils/logger';

import DonatchainABI from "../../../frontend/src/abi/Donatchain.json" 

// Initialize Ethereum provider using RPC URL from config
const provider = new ethers.JsonRpcProvider(config.rpcProvider);
// Initialize wallet if private key is provided in config
let wallet: ethers.Wallet | null = null;
if (config.contractPrivateKey) {
  wallet = new ethers.Wallet(config.contractPrivateKey, provider);
}
// Initialize smart contract instance connected via wallet or provider

const contract = new ethers.Contract(config.contractAddress, DonatchainABI.abi, wallet ?? provider);

// ether exchange rate logic
const ethExchangeRateApi = config.ethExchangeRateApi;
const exchangeRate = { eth: 0 }
export type ExchangeRateApi = { ethereum: { ils: number } }
const parseRateApi = (response: ExchangeRateApi) => {
  return response.ethereum.ils
}

export default {
  rateApi: `${ethExchangeRateApi}?ids=ethereum&vs_currencies=ils`,
  exchangeRate,
  parseRateApi,
  provider,
  wallet,
  contract,
   /**
   * Record a fiat (credit) donation on-chain via the smart contract
   * @param campaignId - ID of the campaign
   * @param ILSAmount - donation amount in ILS
   * @param originalAmount - original amount before conversion
   * @param currency - original currency
   * @param refCode - reference code for donation
   * @returns transaction hash
   */
  async recordFiatDonation(campaignId: number, ILSAmount: number, originalAmount: number, currency: string, refCode: string) {
    // const tx = await contract.recordCreditDonation(campaignId, Math.floor(ILSAmount*100), Math.floor(originalAmount*100), currency, refCode);
    const tx = await contract.recordCreditDonation(campaignId, originalAmount,ILSAmount, currency, refCode);
    console.log("tx sent:", tx.hash);
    await tx.wait();
    console.log("התרומה נרשמה בבלוקצ’יין");
    return tx.hash;
  },
  async getTransaction(txHash: string) {
    return provider.getTransactionReceipt(txHash);
  },
  async waitForTx(txHash: string) {
    return provider.waitForTransaction(txHash);
  },

  async sendTx(tx: ethers.TransactionRequest) {
    if (!wallet) throw new Error('No wallet configured to send tx');
    return wallet.sendTransaction(tx);
  }
  ,
  listenToEvents(contractAbi: any, eventName: string, cb: (...args: any[]) => void) {
    const c = contract //this.contract(contractAbi);
    c.on(eventName, cb);
    logger.info(`Listening to ${eventName}`);
  },
  async toggleCryptoCampaignStatus(opts: {
    blockchainTx: number;
    newActive: boolean;
  }): Promise<{ status: true, onchainId: string } | { status: false, message: string }> {

    const tx = await contract.updateCampaignActive(
      opts.blockchainTx,
      opts.newActive,
    );

    const receipt = await tx.wait();
    const event = receipt.logs
      .map((log: { topics: ReadonlyArray<string>; data: string; }) => { try { return contract.interface.parseLog(log); } catch { return null; } })
      .find((p: { name: string; } | null) => p && (p as any).name === "CampaignStatusChanged");
    const onchainId = (event as any)?.args?.campaignId;
    return { status: true, onchainId };
  },
  async toggleCryptoCampaignsStatus(opts: {
    campaignIds: number[];
    newActive: boolean;
  }): Promise<{ status: true, onchainId: string } | { status: false, message: string }> {

    const tx = await contract.updateManyCampaignsActive(
      opts.campaignIds,
      opts.newActive,
    );

    const receipt = await tx.wait();
    const event = receipt.logs
      .map((log: { topics: ReadonlyArray<string>; data: string; }) => { try { return contract.interface.parseLog(log); } catch { return null; } })
      .find((p: { name: string; } | null) => p && (p as any).name === "ManyCampaignsStatusChanged");
    const onchainId = (event as any)?.args?.campaignId;
    return { status: true, onchainId };

  }
};
