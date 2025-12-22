import nodemailer from "nodemailer";
import { config } from "../config";

// Create a reusable transporter object using Gmail service.
// Auth credentials are loaded from environment variables.
export const transporter = nodemailer.createTransport({
  host: config.emailServer,
  port: config.emailPort,
  secure: false,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

// Sends an email to a member notifying them about NGO activation/suspension status.
export async function sendMemberStatusEmail({
    to,
    fullName,
    ngoName,
    isActive,
}: {
    to: string;
    fullName: string;
    ngoName: string;
    isActive: boolean;
}) {
    const subject = isActive
        ? `העמותה "${ngoName}" הופעלה מחדש`
        : `העמותה "${ngoName}" הושהתה`;

    const html = `
    <div style="direction: rtl; text-align: right; font-family: 'Assistant', Arial; background-color:#f9f9f9; padding:25px;">
      <h2 style="color:${isActive ? "#2e7d32" : "#c62828"};">${subject}</h2>
      <p>שלום ${fullName},</p>
      <p>עמותת <b>${ngoName}</b> ${isActive ? "הופעלה מחדש על ידי מנהל המערכת." : "הושהתה זמנית על ידי מנהל המערכת."}</p>
      ${isActive
            ? "<p>הפעילות חזרה לסדרה ותוכל/י להשתמש שוב במערכת DonatChain.</p>"
            : "<p>המערכת לא מאפשרת כניסה עד להודעה חדשה ממנהל המערכת.</p>"
        }
      <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;"/>
      <p>בברכה,<br/>צוות <b>DonatChain</b></p>
    </div>
  `;

    try {
        await transporter.sendMail({
            from: `"DonatChain" <${config.emailUser}>`,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error("Error sending email to an association member:", err);
    }
}

// Sends an email to the NGO contact regarding activation/suspension status.
export async function sendNgoStatusEmail({
    to,
    ngoName,
    isActive,
}: {
    to: string;
    ngoName: string;
    isActive: boolean;
}) {
    const subject = isActive
        ? ` העמותה "${ngoName}" הופעלה מחדש`
        : ` העמותה "${ngoName}" הושהתה זמנית`;

    const html = `
    <div style="direction: rtl; text-align: right; font-family: 'Assistant', Arial; background-color:#f9f9f9; padding:25px;">
      <h2 style="color:${isActive ? "#2e7d32" : "#c62828"};">${subject}</h2>
      <p>שלום רב,</p>
      <p>עמותת <b>${ngoName}</b> ${isActive ? "הופעלה מחדש על ידי מנהל המערכת." : "הושהתה זמנית על ידי מנהל המערכת."}</p>
      ${isActive
            ? "<p>העמותה יכולה כעת להתחבר למערכת ולנהל קמפיינים כרגיל.</p>"
            : "<p>המערכת לא מאפשרת כניסה עד להודעה חדשה ממנהל המערכת.</p>"
        }
      <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;"/>
      <p>בברכה,<br/>צוות <b>DonatChain</b></p>
    </div>
  `;

    try {
        await transporter.sendMail({
            from: `"DonatChain" <${config.emailUser}>`,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error("Error sending email to the association:", err);
    }
}