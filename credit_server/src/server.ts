import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import * as QRCode from 'qrcode';

dotenv.config();

const PORT = process.env.PORT || 8890;
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

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

export async function generateReceiptPDF({
  donorFirstName,
  donorLastName,
  amount,
  currency,
}: DonationData): Promise<string> {
  const pdfPath = path.join(__dirname, `receipt_${Date.now()}.pdf`);
  const fontPath = path.join(__dirname, 'fonts', 'Assistant-Regular.ttf');
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);


  doc.registerFont('HebrewFont', fontPath);
  doc.font('HebrewFont');

  const black = '#000000';

  const logoPath = path.join(__dirname, '../frontend/public/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 460, 40, { width: 90, align: 'right' });
  }

  doc
    .fillColor(black)
    .fontSize(26)
    .text('קבלה על תרומה', { align: 'right' });
  doc.moveDown(0.5);


  doc
    .moveTo(50, 100)
    .lineTo(550, 100)
    .lineWidth(1.5)
    .strokeColor(black)
    .stroke();
  doc.moveDown(2);


  const donationDetails = [
    [' שם התורם', `${donorFirstName} ${donorLastName}`],
    ['סכום התרומה', `${amount} ${currency}`],
    ['תאריך התרומה', new Date().toLocaleString('he-IL')],
    ['מספר קבלה', `DC-${Date.now().toString().slice(-6)}`],
  ];

  let startY = 130;
  const rowHeight = 32;

  donationDetails.forEach(([label, value], i) => {
    const y = startY + i * rowHeight;

    doc
      .fillColor(black)
      .fontSize(14)
      .text(label, 480, y, { align: 'right' }) 
      .text(value, 300, y, { align: 'left' }); 
  });

  doc.moveDown(4);

  doc
    .fontSize(16)
    .fillColor(black)
    .text('תרומתך על רבה תודה', { align: 'center' });
  doc.moveDown(0.5);
  doc
    .fontSize(13)
    .fillColor(black)
    .text('תודה רבה על תרומתך ותמיכתך בעשייה שלנו! התרומה שלך מאפשרת לנו להמשיך ולעזור לקהילה', {
      align: 'center',
    });

  // ✅ QR
  const qrData = 'https://www.donatchain.org';
  const qrImage = await QRCode.toDataURL(qrData);
  const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');
  doc.image(qrBuffer, 60, 660, { width: 90 });
  doc.fontSize(10).fillColor(black)
    .text('סרוקי למידע נוסף על DonatChain', 50, 755, { align: 'center' });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(pdfPath));
    writeStream.on('error', reject);
  });
}





async function sendReceiptEmail(data: DonationData): Promise<void> {
  const pdfPath = await generateReceiptPDF(data);

  const mailOptions = {
    from: `"DonatChain Receipts" <${process.env.EMAIL_USER}>`,
    to: data.donorEmail,
    subject: 'קבלה על תרומה - DonatChain',
    html: `
      <div style="font-family: Arial; direction: rtl; text-align: right;">
        <h2>תודה על תרומתך!</h2>
        <p>שלום ${data.donorFirstName} ${data.donorLastName},</p>
        <p>אנו מודים לך על תרומתך בסך <b>${data.amount} ${data.currency}</b>.</p>
        <p>מצורפת קבלה בפורמט PDF.</p>
        <hr/>
        <p>תאריך: ${new Date().toLocaleString('he-IL')}</p>
        <p>צוות DonatChain</p>
      </div>
    `,
    attachments: [
      {
        filename: 'קבלה.pdf',
        path: pdfPath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email + PDF sent successfully to ${data.donorEmail}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  } finally {

    fs.unlink(pdfPath, () => {});
  }
}


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
