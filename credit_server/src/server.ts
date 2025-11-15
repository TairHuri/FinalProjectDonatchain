import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from 'node-fetch';
import cron from 'node-cron'

dotenv.config();

const PORT = process.env.PORT || 8890;
const BANK_OF_ISRAEL_API = process.env.BANK_OF_ISRAEL_API || 8890;
const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const exchangeRate = {
  USD: 3.5,
  EUR: 4.2,
  ILS: 1,
}

type BOISuccess = { key: string; currentExchangeRate: number; currentChange: number; unit: number, lastUpdate: string }
type BOIFailure = { succeeded: boolean, failException: string | null, title: string | null, message: string }
// https://boi.org.il/PublicApi/GetExchangeRate?key=USD
// {"key":"USD","currentExchangeRate":3.235,"currentChange":0.810221252726706138984107200,"unit":1,"lastUpdate":"2025-11-14T10:29:30.5727452Z"}
//{"succeeded":false,"failException":null,"title":null,"message":"There is no such exchange rate"}
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
    // כאן רק ביצוע החיוב בפועל (ללא שליחת מייל)
    const { amount, currency }: { amount: number, currency: keyof typeof exchangeRate } = req.body;
    let charge = +amount;

    const rate = exchangeRate[currency];
    if (rate) {
      charge *= rate;
    }else{
      throw new Error(`invalid currency ${currency}`)
    }

    // שליחה של תגובה ל-backend
    res.send({ message: "ok", charge, code: `PAY${Date.now()}` });
  } catch (error: any) {
    console.error("Charge error:", error.message);
    res.status(400).send({ message: "Payment failed", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Credit Server ready on port ${PORT}`);
});
