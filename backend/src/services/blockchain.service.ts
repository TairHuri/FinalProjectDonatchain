import { config } from '../config';
import { ethers } from 'ethers';
import logger from '../utils/logger';

import DonatchainABI from "../../../frontend/src/abi/Donatchain.json" //assert { type: "json" };

const provider = new ethers.JsonRpcProvider(config.rpcProvider);
let wallet: ethers.Wallet | null = null;
if (config.contractPrivateKey) {
  wallet = new ethers.Wallet(config.contractPrivateKey, provider);
}
const contract = new ethers.Contract(config.contractAddress, DonatchainABI.abi, wallet ?? provider);
export default {
  provider,
  wallet,
  contract,
  // contract: (abi: any) => {
  //   if (!config.contractAddress) throw new Error('No contract address configured');
  //   return new ethers.Contract(config.contractAddress, abi, wallet ?? provider);
  // },
  async recordFiatDonation(campaignId:number, amountFiat:number,currency:string, refCode:string) {
    // const campaignId = 0;
    // const amountFiat = 5000; // באגורות = 50₪
    // const currency = "ILS";
    // const refCode = "PAY12345";

    const tx = await contract.recordFiatDonation(campaignId, amountFiat, currency, refCode);
    console.log("tx sent:", tx.hash);
    await tx.wait();
    console.log("התרומה נרשמה בבלוקצ’יין ✅");
    return tx.hash;
  },
  async getTransaction(txHash: string) {
    return provider.getTransactionReceipt(txHash);
  },
  async waitForTx(txHash: string) {
    return provider.waitForTransaction(txHash);
  },
  // אם תרצי לשלוח tx מה backend (לרישום קמפות/רשומות), תעשי בזהירות:
  async sendTx(tx: ethers.TransactionRequest) {
    if (!wallet) throw new Error('No wallet configured to send tx');
    return wallet.sendTransaction(tx);
  }
  ,
  listenToEvents(contractAbi: any, eventName: string, cb: (...args: any[]) => void) {
    const c = contract //this.contract(contractAbi);
    c.on(eventName, cb);
    logger.info(`Listening to ${eventName}`);
  }
};
