import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import * as QRCode from "qrcode";
import { transporter } from "../middlewares/email.middleware";
import {config} from '../config'

export interface DonationData {
  donorEmail: string;
  donorFirstName: string;
  donorLastName: string;
  amount: number;
  currency: string;
  method: "credit" | "crypto";
  txHash?: string;
}

async function generateReceiptPDF(data: DonationData): Promise<string> {
  const pdfPath = path.join(__dirname, `receipt_${Date.now()}.pdf`);
  const doc = new PDFDocument({ size: "A4", margin: 60 });
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  const fontPath = path.resolve(process.cwd(), "src/utils/fonts/NotoSansHebrew.ttf");
  if (fs.existsSync(fontPath)) {
    doc.registerFont("HebrewFont", fontPath);
    doc.font("HebrewFont");
  }

  const right: PDFKit.Mixins.TextOptions = { align: "right" };
  doc.fillColor("#000000");

  const fixHebrew = (text: string) =>
    text
      .split(" ")
      .reverse()
      .map((w) => (/\d/.test(w) ? w.split("").reverse().join("") : w))
      .join(" ");

doc.lineWidth(1).strokeColor("#aaaaaa");
doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke();


const logoPath = path.resolve(__dirname, "../../../frontend/public/log.png");

if (fs.existsSync(logoPath)) {
  doc.image(logoPath, 60, 50, { width: 90 }); 
} else {
  console.warn("Logo not found in path:", logoPath);
}

  doc.fontSize(26).text(fixHebrew(" קבלה על תרומה"), 60, 70, right);
  doc.moveDown(0.3);
  doc.fontSize(12).text(fixHebrew(" מסמך רשמי מאת DonatChain"), right);

 
  doc.moveTo(60, 115).lineTo(doc.page.width - 60, 115).strokeColor("#dddddd").stroke();

  const receiptNumber = `DC-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleString("he-IL");

  const details = [
    [" שם התורם", ` ${ data.donorFirstName} ${data.donorLastName} `],
    [" אימייל", data.donorEmail ],
    [" סכום ", `${data.amount} ${data.currency} `],
    [" שיטת התרומה", data.method === "crypto" ? " מטבע קריפטו" : " כרטיס אשראי" ],
    [" תאריך ", date ],
    [" מספר קבלה", receiptNumber ],
  ];


  doc.moveDown(1.2);
  const startY = doc.y;
  const colLabelX = doc.page.width - 200;
  const colValueX = doc.page.width - 400;

  doc.fontSize(14);

details.forEach(([label, value]) => {
  const fixedLabel = fixHebrew(`${label}:`);


  const fixedValue = /[A-Za-z0-9@.:]/.test(value) ? value : fixHebrew(value);

  doc.text(fixedLabel, colLabelX, doc.y, { align: "right" });
  doc.text(fixedValue, colValueX, doc.y, { align: "right" });
  doc.moveDown(0.5);
});


  doc.moveDown(1);
  doc.moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y).strokeColor("#dddddd").stroke();

  doc.moveDown(1.5);
  doc.fontSize(18).text(fixHebrew(" תודה רבה על תרומתך!"), { align: "center" });
  doc.moveDown(0.3);
  doc.fontSize(12).text(
    fixHebrew(" התרומה שלך מסייעת לנו להמשיך בעשייה החברתית והקהילתית."),
    { align: "center" }
  );


  doc.moveDown(2);
  doc.fontSize(12).text(fixHebrew("בברכה,"), right);
  doc.text(fixHebrew("צוות DonatChain"), right);

let qrData = "https://www.donatchain.org";
if (data.txHash) qrData = `https://sepolia.etherscan.io/tx/${data.txHash}`;
const qrImage = await QRCode.toDataURL(qrData);
const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");


const qrX = 70;
const qrY = doc.page.height - 240;

doc.roundedRect(qrX - 5, qrY - 5, 110, 110, 8).stroke("#cccccc");
doc.image(qrBuffer, qrX, qrY, { width: 100 });

doc.fontSize(10)
  .fillColor("#000000")
  .text(fixHebrew(" סרוק למעקב אחר התרומה"), qrX - 10, qrY + 115, {
    width: 120,
    align: "center",
  });


  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(pdfPath));
    writeStream.on("error", reject);
  });
}

export async function sendReceiptEmail(data: DonationData): Promise<void> {
  const pdfPath = await generateReceiptPDF(data);

  const mailOptions = {
    from: `"DonatChain" <${config.emailUser}>`,
    to: data.donorEmail,
    subject: "קבלה על תרומה - DonatChain",
    html: `
      <div style="font-family: 'Assistant', Arial; direction: rtl; text-align: right;">
        <h2 style="color:#333;">תודה על תרומתך!</h2>
        <p>שלום ${data.donorFirstName} ${data.donorLastName},</p>
        <p>תרומתך בסך <b>${data.amount} ${data.currency}</b> התקבלה בהצלחה.</p>
        <p>שיטת התרומה: <b>${data.method === "crypto" ? "קריפטו" : "כרטיס אשראי"}</b>.</p>
        <p>מצורפת קבלה בפורמט PDF.</p>
        <hr style="margin-top:20px; margin-bottom:20px;"/>
        <p>בברכה,<br/>צוות DonatChain</p>
      </div>
    `,
    attachments: [{ filename: "receipt.pdf", path: pdfPath }],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  } finally {
    fs.unlink(pdfPath, () => {});
  }
}
