import cron from "node-cron";
import fetch from 'node-fetch';
import blockchainService, { ExchangeRateApi } from "../services/blockchain.service";

const getEtherRate = async () => {
    //    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=ils"
    const res = await fetch(blockchainService.rateApi);
    const data:ExchangeRateApi = await res.json();
    blockchainService.exchangeRate.eth = blockchainService.parseRateApi(data)
    
  };
export const startCryptoRateJob = () => {

  cron.schedule("0 5 * * * *", getEtherRate)

};
getEtherRate();