
import puppeteer from "puppeteer";
import { ICampaign } from "../models/campaign.model";
import { IDonation } from "../models/donation.model";
import fs from "node:fs";


import path from 'path';



export const reportFolder = path.join(process.cwd(), 'reports')
export const generateCampaignReport = async (campaign: ICampaign, donations: IDonation[], includeDonations: boolean, includeComments: boolean) => {

  // עוזר: עיצוב מספרים/תאריכים
  const fmt = new Intl.NumberFormat("he-IL");
  const dateFmt = new Intl.DateTimeFormat("he-IL", { dateStyle: "short" });
  const dateDonationFmt = new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: 'short' });

  // בונים HTML עם RTL
  const html = buildHtml({
    campaign,
    donations,
    fmtNumber: (n: number) => fmt.format(n),
    fmtDate: (d: Date) => dateFmt.format(new Date(d)),
    dateDonationFmt: (d: Date) => dateDonationFmt.format(new Date(d)),
    includeDonations,
    includeComments,
    imagesBaseUrl: process.env.IMAGES_URL || "http://localhost:4000/images",
    etherscanUrl: process.env.ETHERSCAN_URL || "https://sepolia.etherscan.io/tx",

  });

  // מרימים דפדפן ריק ומייצרים PDF
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--font-render-hinting=none"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "18mm", right: "12mm", bottom: "18mm", left: "12mm" },
    displayHeaderFooter: true,
    headerTemplate: headerTemplate(),
    footerTemplate: footerTemplate(),
  });

 
  await browser.close();
  const filename = `campaign-${campaign._id.toString()}.pdf`;
  //await fs.promises.writeFile(`${reportFolder}/${filename}`, pdf); //sava report on disk in report folder
  return { filename, pdf }

};



// פונקציות עזר ל-HTML
function headerTemplate() {
  return `
  <style>
    .hdr{ font-family: Heebo, Arial, sans-serif; font-size:10px; color:#111; width:100%; padding:0 12mm; }
  </style>
  <div class="hdr">
    <div style="display:flex; justify-content:space-between;">
      <span>DonatChain - דוח קמפיין</span>
      <span class="date"></span>
    </div>
  </div>`;
}



function footerTemplate() {
  return `
  <style>
    .ftr{ font-family: Heebo, Arial, sans-serif; font-size:10px; color:#444; width:100%; padding:0 12mm; }
  </style>
  <div class="ftr">
    <div style="display:flex; justify-content:space-between;">
      <span>עמוד <span class="pageNumber"></span> מתוך <span class="totalPages"></span></span>
      <span>© DonatChain</span>
    </div>
  </div>`;
}

function buildHtml(opts: {
  campaign: any;
  donations: any[];
  fmtNumber: (n: number) => string;
  fmtDate: (d: Date) => string;
  dateDonationFmt: (d: Date) => string;
  includeDonations: boolean;
  includeComments: boolean;
  imagesBaseUrl: string;
  etherscanUrl: string;
}) {
  const { campaign, donations, fmtNumber, fmtDate, dateDonationFmt, includeDonations, includeComments, imagesBaseUrl, etherscanUrl } = opts;

  const percent = Math.min((campaign.raised / Math.max(campaign.goal, 1)) * 100, 100);

  // שימי לב: ל-RTL תקפידי על dir="rtl" ועל יישור ימין
  return `
<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  @page { size: A4; margin: 18mm 12mm; }
  body { font-family: Heebo, Arial, sans-serif; color:#111; }
  h1,h2,h3 { margin:0 0 8px; }
  .section { margin: 16px 0; }
  .row { display:flex; align-items:center; gap:16px; }
  .logo { width:72px; height:72px; border-radius:50%; object-fit:cover; }
  .muted { color:#555; }
  .pill { background:#e8fff1; color:#0b5e37; padding:4px 8px; border-radius:999px; font-size:12px; display:inline-block; }
  .stat { background:#f7f7f7; border:1px solid #eee; padding:12px; border-radius:8px; }
  .bar{ width:100%; height:10px; background:#eee; border-radius:999px; overflow:hidden; }
  .bar>div{ height:10px; width:${percent}%; background:#22c55e; }
  table { width:100%; border-collapse:collapse; }
  th, td { border:1px solid #e5e7eb; padding:8px; font-size:12px; vertical-align:top; }
  th { background:#fafafa; }
  a { color:#0b5e37; text-decoration:none; }
  .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
  .right { text-align:right; }
  .small { font-size:12px; }
</style>
</head>
<body>

  <!-- כותרת -->
  <div class="section">
    <div class="row">
      <img class="logo" src="${imagesBaseUrl}/${campaign.ngo?.logoUrl || ""}" />
      <div>
        <h1>${escapeHtml(campaign.title)}</h1>
        <div class="muted small">${escapeHtml(`${campaign.ngo?.name ?? ""}${campaign.ngo?.ngoNumber ? ` (מס' ${campaign.ngo.ngoNumber})` : ""}`)}</div>
      </div>
    </div>
  </div>

  <!-- מטרות והתקדמות -->
  <div class="section grid2">
    <div class="stat">
      <h3>סטטוס גיוס</h3>
      <div class="bar"><div></div></div>
      <div class="row" style="justify-content:space-between; margin-top:8px;">
        <div><strong>${fmtNumber(campaign.raised)} ₪</strong> נאספו</div>
        <div class="muted">${fmtNumber(campaign.goal)} ₪ יעד</div>
        <div class="pill">${percent.toFixed(1)}%</div>
      </div>
      <div class="small muted" style="margin-top:6px;">מספר תורמים: ${campaign.numOfDonors || 0}</div>
    </div>

    <div class="stat">
      <h3>פרטי קמפיין</h3>
      <div class="small"><strong>תאריך התחלה:</strong> ${campaign.startDate ? fmtDate(campaign.startDate) : "-"}</div>
      <div class="small"><strong>תאריך סיום:</strong> ${campaign.endDate ? fmtDate(campaign.endDate) : "-"}</div>
      <div class="small"><strong>סטטוס:</strong> ${campaign.isActive ? "פעיל" : "לא פעיל"}</div>
      ${campaign.tags?.length ? `<div class="small"><strong>תגיות:</strong> ${campaign.tags.map(escapeHtml).join(" • ")}</div>` : ""}
    </div>
  </div>

  <!-- תיאור -->
  <div class="section">
    <h3>תיאור הקמפיין</h3>
    <div class="small">${nl2br(escapeHtml(campaign.description || ""))}</div>
  </div>

  ${includeDonations
      ? `
  <!-- תרומות -->
  <div class="section">
    <h3>תרומות</h3>
    <table>
      <thead>
        <tr>
          <th class="right">תורם</th>
          <th class="right">אימייל</th>
          <th class="right">טלפון</th>
          <th class="right">סכום</th>
          <th class="right">מטבע</th>
          <th class="right">תאריך</th>
          <th class="right">Transaction</th>
          ${includeComments ? `<th class="right">הודעת תורם</th>` : ``}
        </tr>
      </thead>
      <tbody>
        ${donations
        .map((d: IDonation) => {
          const donor = `${escapeHtml(d.firstName || "")} ${escapeHtml(d.lastName || "")}`.trim();
          return `
              <tr>
                <td class="right">${donor || "-"}</td>
                <td class="right">${d.email || "-"}</td>
                <td class="right">${d.phone || "-"}</td>
                <td class="right">${fmtNumber(d.amount)}</td>
                <td class="right">${escapeHtml(d.currency || "")}</td>
                <td class="right">${d.createdAt ? dateDonationFmt(d.createdAt) : "-"}</td>
                <td class="right">${d.txHash ? `<a href="${etherscanUrl}/${d.txHash}" target="_blank">${escapeHtml(shortHash(d.txHash))}</a>` : "-"}</td>
                ${includeComments ? `<td class="right small">${d.comment ? nl2br(escapeHtml(d.comment)) : "-"}</td>` : ``}
              </tr>
            `;
        })
        .join("")}
      </tbody>
    </table>
  </div>
  `
      : ``
    }

</body>
</html>
`;
}

function escapeHtml(s: string) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function nl2br(s: string) {
  return s.replace(/\n/g, "<br/>");
}
function shortHash(h: string) {
  return h && h.length > 12 ? `${h.slice(0, 8)}...${h.slice(-6)}` : h;
}
