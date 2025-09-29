import { config } from '../config';
import { ethers } from 'ethers';
import logger from '../utils/logger';

const provider = new ethers.JsonRpcProvider(config.rpcProvider);

let wallet: ethers.Wallet | null = null;
if (config.contractPrivateKey) {
  wallet = new ethers.Wallet(config.contractPrivateKey, provider);
}

export default {
  provider,
  wallet,
  contract: (abi: any) => {
    if (!config.contractAddress) throw new Error('No contract address configured');
    return new ethers.Contract(config.contractAddress, abi, wallet ?? provider);
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
    const c = this.contract(contractAbi);
    c.on(eventName, cb);
    logger.info(`Listening to ${eventName}`);
  }
};
