// pdf-campaign.ts
import fs from "node:fs";
import PDFDocument from "pdfkit";
import { ICampaign } from "../models/campaign.model";
import { IDonation } from "../models/donation.model";
import { INgo } from "../models/ngo.model";


type CreatePdfOptions = {
  outputPath?: string;                 // אם לא, יוחזר Buffer
  pageSize?: PDFKit.PDFDocumentOptions["size"];
  fontPathRegular?: string;            // הצמידי כאן פונט שתומך בעברית (WOFF/TTF/OTF)
  fontPathBold?: string;
  rtl?: boolean;                       // אם תרצי ליישר לימין
};

export async function createCampaignPdf(
  campaign: ICampaign,
  donations: IDonation[],
  opts: CreatePdfOptions = {}
): Promise<Buffer | void> {
  const {
    outputPath,
    pageSize = "A4",
    fontPathRegular,
    fontPathBold,
    rtl = false,
  } = opts;

  const doc = new PDFDocument({
    size: pageSize,
    margin: 50,
    bufferPages: true
  });

  let outStream: fs.WriteStream | null = null;
  const chunks: Buffer[] = [];
  const resultPromise: Promise<Buffer | void> = new Promise((resolve, reject) => {
    if (outputPath) {
      outStream = fs.createWriteStream(outputPath);
      doc.pipe(outStream);
      outStream.on("finish", () => resolve());
      outStream.on("error", reject);
    } else {
      doc.on("data", (c: Buffer) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    }
    doc.on("error", reject);
  });

  // Fonts
  if (fontPathRegular) {
    doc.registerFont("Regular", fontPathRegular);
    doc.font("Regular");
  }
  if (fontPathBold) {
    doc.registerFont("Bold", fontPathBold);
  }

  const isRTL = !!rtl;
  const alignMain: PDFKit.Mixins.TextOptions["align"] = isRTL ? "right" : "left";

  // Helpers
  const fmtNumber = (n?: number) =>
    typeof n === "number" ? n.toLocaleString("he-IL") : "-";
  const fmtDate = (d?: string | Date) => {
    if (!d) return "-";
    const dd = typeof d === "string" ? new Date(d) : d;
    if (isNaN(dd.getTime())) return "-";
    return new Intl.DateTimeFormat("he-IL", { dateStyle: "medium", timeStyle: "short" }).format(dd);
  };
  const line = (y?: number) => {
    const yy = y ?? doc.y;
    doc
      .moveTo(doc.page.margins.left, yy)
      .lineTo(doc.page.width - doc.page.margins.right, yy)
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .stroke();
  };
  const ensureSpace = (h: number) => {
    if (doc.y + h > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
  };

  // Header
  doc.fillColor("#111");
  if (fontPathBold) doc.font("Bold");
  doc.fontSize(20).text(campaign.title || "Campaign", { align: alignMain });
  if (fontPathRegular) doc.font("Regular");
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor("#555")
    .text(`NGO #: ${(campaign.ngo as unknown as INgo).ngoNumber ?? "-"}`, { align: alignMain });

  doc.moveDown(0.4);
  line();
  doc.moveDown(0.6);

  // Campaign Stats (two columns)
  const leftX = doc.page.margins.left;
  const rightX = doc.page.width / 2 + 10;
  const colWidth = doc.page.width / 2 - doc.page.margins.left - 10;

  const drawLabelValue = (label: string, value: string, x: number, y: number) => {
    doc.save();
    doc.fontSize(11).fillColor("#000");
    if (fontPathBold) doc.font("Bold");
    doc.text(label, x, y, { width: colWidth, align: alignMain });
    if (fontPathRegular) doc.font("Regular");
    doc.fillColor("#222").moveDown(0.15);
    doc.fontSize(11).text(value, { width: colWidth, align: alignMain });
    doc.restore();
  };

  let yTop = doc.y;

  drawLabelValue("יעד (Goal):", `${fmtNumber(campaign.goal)} ${campaign.currency}`, isRTL ? rightX : leftX, yTop);
  drawLabelValue("נאסף (Raised):", `${fmtNumber(campaign.raised)} ${campaign.currency}`, isRTL ? rightX : leftX, yTop + 35);
  drawLabelValue("מס׳ תורמים:", `${campaign.numOfDonors ?? 0}`, isRTL ? rightX : leftX, yTop + 70);
  drawLabelValue("סטטוס:", campaign.isActive ? "פעיל" : "לא פעיל", isRTL ? rightX : leftX, yTop + 105);

  drawLabelValue("תאריך התחלה:", fmtDate(campaign.startDate), isRTL ? leftX : rightX, yTop);
  drawLabelValue("תאריך סיום:", fmtDate(campaign.endDate), isRTL ? leftX : rightX, yTop + 35);
  drawLabelValue("נוצר ב־:", fmtDate(campaign.createdAt), isRTL ? leftX : rightX, yTop + 70);
  drawLabelValue("תגיות:", (campaign.tags && campaign.tags.length) ? campaign.tags.join(" • ") : "-", isRTL ? leftX : rightX, yTop + 105);

  ensureSpace(140);
  doc.y = yTop + 145;

  if (campaign.blockchainTx) {
    doc.fontSize(10).fillColor("#0b5e37");
    doc.text(`Blockchain TX: ${campaign.blockchainTx}`, {
      align: alignMain,
      link: campaign.blockchainTx.startsWith("http") ? campaign.blockchainTx : undefined,
      underline: true
    });
    doc.fillColor("#111");
  }

  doc.moveDown(0.5);
  line();
  doc.moveDown(0.6);

  // Description
  if (campaign.description) {
    if (fontPathBold) doc.font("Bold");
    doc.fontSize(13).fillColor("#111").text("תיאור הקמפיין", { align: alignMain });
    if (fontPathRegular) doc.font("Regular");
    doc.moveDown(0.2);
    doc.fontSize(11).fillColor("#222")
      .text(campaign.description, {
        align: alignMain,
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right
      });
    doc.moveDown(0.5);
    line();
    doc.moveDown(0.6);
  }

  // Donations Table
  if (fontPathBold) doc.font("Bold");
  doc.fontSize(13).fillColor("#111").text("תרומות", { align: alignMain });
  if (fontPathRegular) doc.font("Regular");
  doc.moveDown(0.2);

  const columns:{key: keyof IDonation, header:string, width:number}[] = [
    { key: "email",     header: "Email",       width: 120 },
    { key: "phone",     header: "Phone",       width: 90 },
    { key: "firstName", header: "First",       width: 70 },
    { key: "lastName",  header: "Last",        width: 80 },
    { key: "currency",  header: "Curr",        width: 45 },
    { key: "method",    header: "Method",      width: 60 },
    { key: "txHash",    header: "Tx Hash",     width: 120 },
    { key: "comment",   header: "Comment",     width: (doc.page.width - doc.page.margins.left - doc.page.margins.right) - (120+90+70+80+45+60+120) }
  ];

  drawTable({
    doc,
    columns,
    rows: donations,
    align: alignMain,
    headerFill: "#f3f4f6",
    rowStripeFill: "#fafafa",
    textColor: "#111",
    borderColor: "#e5e7eb",
    linkifyTx: true
  });

  doc.end();
  return resultPromise;
}

// ----- Generic Table Drawer for PDFKit -----
function drawTable<T extends Record<string, any>>(cfg: {
  doc: PDFKit.PDFDocument;
  columns: { key: keyof T; header: string; width: number }[];
  rows: T[];
  align?: "left" | "right" | "center" | "justify";
  headerFill?: string;
  rowStripeFill?: string;
  textColor?: string;
  borderColor?: string;
  linkifyTx?: boolean;
}) {
  const {
    doc, columns, rows,
    align = "left",
    headerFill = "#f3f4f6",
    rowStripeFill = "#fafafa",
    textColor = "#111",
    borderColor = "#e5e7eb",
    linkifyTx = false
  } = cfg;

  const startX = doc.page.margins.left;
  const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Header row
  let y = doc.y;
  ensurePageSpace(doc, 28);
  y = doc.y;

  doc.save();
  doc.rect(startX, y, usableWidth, 24).fill(headerFill).fillColor(textColor);
  doc.fillColor("#111");
  doc.fontSize(10);

  let x = startX;
  for (const col of columns) {
    doc.text(col.header, x + 6, y + 6, { width: col.width - 8, align });
    x += col.width;
  }
  doc.restore();

  // Header bottom border
  doc
    .moveTo(startX, y + 24)
    .lineTo(startX + usableWidth, y + 24)
    .strokeColor(borderColor)
    .lineWidth(1)
    .stroke();

  doc.y = y + 26;

  // Rows
  rows.forEach((row, idx) => {
    // Calculate row height based on wrapped text per cell:
    const cellHeights = columns.map(col => {
      const val = valueToString(row[col.key]);
      const h = doc.heightOfString(val, {
        width: col.width - 8,
        align
      });
      return Math.max(h + 8, 22); // padding
    });
    const rowH = Math.max(...cellHeights);

    ensurePageSpace(doc, rowH + 4);

    const rowY = doc.y;
    // Stripe background
    if (idx % 2 === 0) {
      doc.save();
      doc.rect(startX, rowY, usableWidth, rowH).fill(rowStripeFill);
      doc.restore();
    }

    // Text cells
    let xx = startX;
    for (const col of columns) {
      const raw = row[col.key];
      const val = valueToString(raw);

      // linkify tx hash (Etherscan) when looks like a tx:
      const isTx = linkifyTx && col.key === "txHash" && typeof raw === "string" && /^0x[0-9a-fA-F]{20,}$/.test(raw);
      if (isTx) {
        doc
          .fillColor("#0b5e37")
          .text(val, xx + 6, rowY + 4, {
            width: col.width - 8,
            align,
            link: `https://sepolia.etherscan.io/tx/${raw}`,
            underline: true
          })
          .fillColor(textColor);
      } else {
        doc
          .fillColor(textColor)
          .text(val, xx + 6, rowY + 4, {
            width: col.width - 8,
            align
          });
      }
      xx += col.width;
    }

    // Bottom border
    doc
      .moveTo(startX, rowY + rowH)
      .lineTo(startX + usableWidth, rowY + rowH)
      .strokeColor(borderColor)
      .lineWidth(1)
      .stroke();

    doc.y = rowY + rowH + 2;
  });

  function ensurePageSpace(d: PDFKit.PDFDocument, h: number) {
    if (d.y + h > d.page.height - d.page.margins.bottom) {
      d.addPage();
    }
  }

  function valueToString(v: any): string {
    if (v === null || v === undefined) return "-";
    if (v instanceof Date) return v.toISOString();
    if (typeof v === "number") return v.toLocaleString("he-IL");
    return String(v);
  }
}
