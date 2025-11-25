import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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
            from: `"DonatChain" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`📧 נשלח מייל לחבר בעמותה: ${to}`);
    } catch (err) {
        console.error("❌ שגיאה בשליחת מייל לחבר עמותה:", err);
    }
}

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
            from: `"DonatChain" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log(` מייל נשלח בהצלחה לעמותה: ${to} (${ngoName})`);
    } catch (err) {
        console.error(" שגיאה בשליחת מייל לעמותה:", err);
    }
}