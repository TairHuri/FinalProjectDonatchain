// src/controllers/ngos.controller.ts
import { Request, Response } from "express";
import Ngo from "../models/ngo.model";
import AuditLog from "../models/auditlog.model";
import { NgoMediaFiles } from "../middlewares/multer.middleware";
import nodemailer from "nodemailer";
import Campaign from "../models/campaign.model";
import service, { ApiSuccessType } from '../services/ngo.service'


export const verifyNgo = async (req: Request, res: Response) =>{
  const {id} = req.params;
  
  if(!id){
    return res.status(400).send({message:'הקלידו את מספר העמותה'})
  }
  const activeResult = await service.verifyNgoActive(id.toString());
  if(!activeResult.status){
    return res.status(400).send({message:activeResult.message})
  }
  
  const approveResult = await service.verifyNgoApproved(id.toString());
  const year = new Date().getFullYear();
  const currentYear = `${year}` as keyof ApiSuccessType;
  const lastYear = `${year-1}` as keyof ApiSuccessType;
  if(approveResult.status === false){
    return res.status(400).send({message: approveResult.message})
  }
  const apiSuccess = approveResult as ApiSuccessType;
  if(apiSuccess[currentYear].status ||apiSuccess[lastYear].status){
    return res.send();
  }
  res.status(400).send({message: `${currentYear}: ${apiSuccess[currentYear].message}, ${lastYear}: ${apiSuccess[lastYear]}`})

}

export const createNgo = async (req: Request, res: Response) => {
  const { name, description, website, contactEmail, logoUrl, certificate, ngoNumber } = req.body;
  const user = (req as any).user;

  try {
        const existingNgo = await Ngo.findOne({
      $or: [
        { name: name.trim() },
        { ngoNumber: ngoNumber?.trim() }
      ],
    });

    if (existingNgo) {
      return res.status(400).json({
        message: "עמותה עם שם זה או מספר עמותה זה כבר קיימת במערכת",
      });
    }

    // ✅ יצירת עמותה חדשה אם לא קיימת
    const ngo = new Ngo({
      name,
      ngoNumber,
      description,
      website,
      email: contactEmail,
      logoUrl,
      certificate,
      createdBy: user._id,
    });

    await ngo.save();

    await AuditLog.create({
      action: "ngo_created",
      user: user._id,
      meta: { ngoId: ngo._id },
    });

    res.status(201).json(ngo);
  } catch (err: any) {
    console.error("שגיאה ביצירת עמותה:", err);
    res.status(400).json({ message: err.message });
  }
};

export const listNgos = async (_req: Request, res: Response) => {
  try {
    const items = await Ngo.aggregate([

      {
        $lookup: {
          from: "campaigns",
          localField: "_id",
          foreignField: "ngo",
          as: "campaigns",
        },
      },
      {
        $addFields: {
          ngoCampaignsCount: { $size: "$campaigns" },
        },
      },
      {
        $project: {
          campaigns: 0,
        },
      },
    ]);

    res.json({ items });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



export const getNgo = async (req: Request, res: Response) => {
  try {
    const ngo = await Ngo.findById(req.params.id).populate("createdBy", "name email");
    if (!ngo) return res.status(404).json({ message: "עמותה לא נמצאה" });
    res.json(ngo);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const toggleNgoStatus = async (req: Request, res: Response) => {
  try {
    const ngo = await Ngo.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: "עמותה לא נמצאה" });

    // הפעלה/השהיה של העמותה
    ngo.isActive = !ngo.isActive;
    await ngo.save({ validateModifiedOnly: true });

    // עדכון כל הקמפיינים של העמותה
    await Campaign.updateMany({ ngo: ngo._id }, { isActive: ngo.isActive });

    // שמירה ביומן פעילות (AuditLog)
    await AuditLog.create({
      action: ngo.isActive ? "ngo_reactivated" : "ngo_suspended",
      user: (req as any).user._id,
      meta: { ngoId: ngo._id, newStatus: ngo.isActive },
    });

    // שליחת מייל לעמותה עצמה
    if (ngo.email) {
      await sendNgoStatusEmail({
        to: ngo.email,
        ngoName: ngo.name,
        isActive: ngo.isActive,
      });
    } else {
      console.warn("⚠️ לא נמצא אימייל לעמותה:", ngo.name);
    }

    // 🔹 שליחת מייל לכל החברים של העמותה
    const User = (await import("../models/user.model")).default; // טעינה דינמית למניעת import מעגלי
    const members = await User.find({ ngoId: ngo._id });

    for (const member of members) {
      if (!member.email) continue;

await sendMemberStatusEmail({
  to: member.email,
  fullName: member.name || "מתנדב/ת יקר/ה", // 👈 משתמשים בשדה הקיים
  ngoName: ngo.name,
  isActive: ngo.isActive,
});
    }

    res.json({
      success: true,
      message: ngo.isActive
        ? "✅ העמותה הופעלה מחדש, כל הקמפיינים הופעלו ונשלחו מיילים לעמותה ולחבריה."
        : "⛔ העמותה הושהתה, כל הקמפיינים הושבתו ונשלחו מיילים לעמותה ולחבריה.",
      ngo,
    });
  } catch (err: any) {
    console.error("❌ toggleNgoStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};

async function sendMemberStatusEmail({
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

async function sendNgoStatusEmail({
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

export const updateNgo = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const ngo = await Ngo.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: "עמותה לא נמצאה" });

    if (!['manager'].includes(user.role)) {
      return res.status(403).json({ message: "אין הרשאה לעדכן עמותה זו" });
    }

    const updates = req.body;
    Object.assign(ngo, updates);

    const mediaFiles = req.files as NgoMediaFiles;
    if (mediaFiles?.logo) {
      ngo.logoUrl = mediaFiles.logo[0].filename;
    }
    if (mediaFiles?.certificate) {
      ngo.certificate = mediaFiles.certificate[0].filename;
    }
    await ngo.save({ validateModifiedOnly: true });
    await AuditLog.create({ action: "ngo_updated", user: user._id, meta: { ngoId: ngo._id } });

    res.json(ngo);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
