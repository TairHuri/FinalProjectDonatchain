import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8890;
const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.post("/api/charge", async (req: Request, res: Response) => {
  try {
    // כאן רק ביצוע החיוב בפועל (ללא שליחת מייל)
    const { amount, currency } = req.body;
    let charge = +amount;

    if (currency === "USD") {
      charge *= 3.5;
    } else if (currency === "EU") {
      charge *= 4.2;
    }

    // שליחה של תגובה ל-backend
    res.send({ message: "ok", charge, code: `PAY${Date.now()}` });
  } catch (error: any) {
    console.error("Charge error:", error.message);
    res.status(500).send({ message: "Payment failed", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Credit Server ready on port ${PORT}`);
});
