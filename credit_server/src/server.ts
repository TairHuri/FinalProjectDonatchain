import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const PORT = process.env.PORT || 8890;
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// הגדרת טיפוס עבור הנתונים של התרומה
interface DonationData {
  donorEmail: string;
  donorFirstName: string;
  donorLastName: string;
  amount: number;
  currency: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// פונקציה לשליחת קבלה
async function sendReceiptEmail({
  donorEmail,
  donorFirstName,
  donorLastName,
  amount,
  currency,
}: DonationData): Promise<void> {
  const mailOptions = {
    from: `"DonatChain Receipts" <${process.env.EMAIL_USER}>`,
    to: donorEmail,
    subject: 'קבלה על תרומה - DonatChain',
    html: `
      <div style="font-family: Arial; direction: rtl; text-align: right;">
        <h2>תודה על תרומתך!</h2>
        <p>שלום ${donorFirstName} ${donorLastName},</p>
        <p>אנו מודים לך על תרומתך בסך <b>${amount} ${currency}</b>.</p>
        <p>התרומה התקבלה בהצלחה במערכת שלנו.</p>
        <hr/>
        <p>תאריך: ${new Date().toLocaleString('he-IL')}</p>
        <p>צוות DonatChain</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${donorEmail}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error sending email:', error.message);
    } else {
      console.error('❌ Unknown error sending email:', error);
    }
  }
}

// נקודת סליקה דמה (חיוב אשראי)
app.post('/api/charge', async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency, donorEmail, donorFirstName, donorLastName } = req.body as DonationData;

    let charge = +amount;
    if (currency === 'USD') {
      charge *= 3.5;
    } else if (currency === 'EU') {
      charge *= 4.2;
    }

    await sendReceiptEmail({ donorEmail, donorFirstName, donorLastName, amount, currency });

    res.send({ message: 'ok', charge });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Charge error:', error.message);
      res.status(500).send({ message: 'Payment failed', error: error.message });
    } else {
      console.error('Unknown charge error:', error);
      res.status(500).send({ message: 'Payment failed', error });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Credit Server ready on port ${PORT}`);
});
