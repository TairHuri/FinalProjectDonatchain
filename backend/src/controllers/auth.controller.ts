import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import ngoService from "../services/ngo.service";
import User, { IUser } from "../models/user.model";
import { BaseNgo } from "../models/ngo.model";
import { NgoMediaFiles } from "../middlewares/multer.middleware";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export const registerNewNgo = async (req: Request, res: Response) => {
  try {
    const {
      userJson,
      name,
      description,
      ngoNumber,
      website,
      bankAccount,
      wallet,
      address,
      phone,
      email,
      tags,
    } = req.body;

    const ngo: BaseNgo = {
      name,
      description,
      ngoNumber,
      website,
      bankAccount,
      wallet,
      address,
      phone,
      email,
      logoUrl: "",
      certificate: "",
      tags,
    };

    const ngoMediaFiles = req.files as NgoMediaFiles;
    const user = JSON.parse(userJson);

    if (ngoMediaFiles.logo) ngo.logoUrl = ngoMediaFiles.logo[0].filename;
    if (ngoMediaFiles.certificate)
      ngo.certificate = ngoMediaFiles.certificate[0].filename;

    if (!user.email || !user.password || !user.name || !user.role)
      return res
        .status(400)
        .json({ success: false, message: "חובה למלא שם, אימייל וסיסמה" });

    const createdNgo = await ngoService.create(ngo);
    user.ngoId = createdNgo._id;
    user.approved = true;

    const createdUser = await AuthService.registerUser(user);
    createdNgo.createdBy = createdUser._id;
    await ngoService.update(createdNgo._id, createdNgo);

    const token = AuthService.signJwt({ sub: createdUser._id.toString() });

    res.status(201).json({
      success: true,
      message: "הרישום התבצע בהצלחה",
      user: {
        id: createdUser._id,
        email: createdUser.email,
        name: createdUser.name,
      },
      token,
    });
  } catch (err: any) {
    console.error(" שגיאה בהרשמה:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};


export const registerExistingNgo = async (req: Request, res: Response) => {
  try {
    const { user }: { user: IUser } = req.body;

    if (!user.email || !user.password || !user.name )
      return res
        .status(400)
        .json({ success: false, message: "חובה למלא שם, אימייל וסיסמה" });

    user.approved = false;
    user.role='member';
    const createdUser = await AuthService.registerUser(user);

    const token = AuthService.signJwt({ sub: createdUser._id.toString() });

    res.status(201).json({
      success: true,
      message: "המשתמש נרשם בהצלחה",
      user: {
        id: createdUser._id,
        email: createdUser.email,
        name: createdUser.name,
      },
      token,
    });
  } catch (err: any) {
    console.error(" שגיאה בהרשמה:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "חובה למלא אימייל וסיסמה" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "אימייל או סיסמה שגויים" });

    if (!user.approved)
      return res
        .status(400)
        .json({ success: false, message: "המשתמש ממתין לאישור מנהל עמותה" });

    const ok = await AuthService.comparePassword(password, user.password);
    if (!ok)
      return res
        .status(400)
        .json({ success: false, message: "אימייל או סיסמה שגויים" });

    if (user.ngoId) {
      const ngo = await ngoService.getById(user.ngoId.toString());
      if (ngo && !ngo.isActive)
        return res.status(403).json({
          success: false,
          message:
            "העמותה שלך מושהית זמנית על ידי מנהל המערכת. לא ניתן להתחבר כרגע.",
        });
    }

    const token = AuthService.signJwt({
      sub: user._id.toString(),
      ngoId: user.ngoId ? user.ngoId.toString() : null,
      role: user.role,
    });

    const { password: _, ...rest } = (user as any)._doc as IUser;
    res.json({ success: true, token, user: rest });
  } catch (err: any) {
    console.error(" שגיאה בהתחברות:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const html = `
      <div style="direction:rtl;text-align:right;font-family:Assistant,Arial;padding:25px;background:#f9f9f9">
        <h2 style="color:#1976d2;">קוד איפוס סיסמה</h2>
        <p>שלום ${user.name|| "משתמש"},</p>
        <p>קיבלת קוד לאיפוס הסיסמה שלך:</p>
        <div style="font-size:22px;font-weight:bold;background:#e3f2fd;padding:10px;border-radius:8px;width:fit-content;">
          ${resetCode}
        </div>
        <p>הקוד תקף ל-15 דקות בלבד.</p>
        <hr/>
        <p>צוות <b>DonatChain</b></p>
      </div>
    `;

    await transporter.sendMail({
      from: `"DonatChain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "איפוס סיסמה - DonatChain",
      html,
    });

    res.json({ success: true, message: "קוד נשלח למייל בהצלחה" });
  } catch (err: any) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "שגיאה בשליחת קוד למייל" });
  }
};


export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email, resetCode: code });
    if (!user) return res.status(400).json({ message: "קוד שגוי" });

    if (user.resetCodeExpires && user.resetCodeExpires < new Date()) {
      return res.status(400).json({ message: "הקוד פג תוקף" });
    }

    res.json({ success: true, message: "הקוד אומת בהצלחה" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email, resetCode: code });
    if (!user) return res.status(400).json({ message: "פרטים שגויים" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ success: true, message: "הסיסמה שונתה בהצלחה" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
