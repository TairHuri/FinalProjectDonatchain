import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from 'node-fetch';
import cron from 'node-cron'

// Load environment variables from .env file
dotenv.config();

// Server configuration
const PORT = process.env.PORT || 8890;
const BANK_OF_ISRAEL_API = process.env.BANK_OF_ISRAEL_API || 8890;
const app = express();

// Enable CORS for cross-origin requests
app.use(cors());
// Parse incoming JSON requests, limit to 5MB to prevent huge payload attacks

app.use(express.json({ limit: "5mb" }));

// Default exchange rates (fallback values)
const exchangeRate = {
  USD: 3.5,
  EUR: 4.2,
  ILS: 1,
}
// Type definitions for Bank of Israel API responses
type BOISuccess = { key: string; currentExchangeRate: number; currentChange: number; unit: number, lastUpdate: string }
type BOIFailure = { succeeded: boolean, failException: string | null, title: string | null, message: string }
// Fetch current exchange rates from Bank of Israel API and update local rates
const getExchangeRates = async () => {
  try {
    for (const key in exchangeRate) {
      if (key === 'ILS') continue;
      const response = await fetch(`${BANK_OF_ISRAEL_API}?key=${key}`)
      const data = await response.json() as BOISuccess | BOIFailure;
      if ((data as BOIFailure).succeeded != undefined) {
        throw new Error(`error getting rate for ${key}, ${(data as BOIFailure).message}`);
      }
      exchangeRate[key as keyof typeof exchangeRate] = (data as BOISuccess).currentExchangeRate
    }
  } catch (error) {
    console.log((error as any).message);
  }
  console.log('updated currencies from bank of Israel', exchangeRate);
  
}

getExchangeRates();

const scheduleDailyRate = () => {
  cron.schedule('0 0 16 * * *', getExchangeRates);
}
scheduleDailyRate();

app.post("/api/charge", async (req: Request, res: Response) => {
  try {

    const { amount, currency }: { amount: number, currency: keyof typeof exchangeRate } = req.body;
    let charge = +amount;

    const rate = exchangeRate[currency];
    if (rate) {
      charge *= rate;
    }else{
      throw new Error(`invalid currency ${currency}`)
    }


    res.send({ message: "ok", charge, code: `PAY${Date.now()}` });
  } catch (error: any) {
    console.error("Charge error:", error.message);
    res.status(400).send({ message: "Payment failed", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Credit Server ready on port ${PORT}`);
});
