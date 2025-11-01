import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import ngoService from "../services/ngo.service";
import User, { IUser } from "../models/user.model";
import { BaseNgo } from "../models/ngo.model";
import { NgoMediaFiles } from "../middlewares/multer.middleware";

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
    };

    const ngoMediaFiles = req.files as NgoMediaFiles;
    const user = JSON.parse(userJson);

    if (ngoMediaFiles.logo) {
      ngo.logoUrl = ngoMediaFiles.logo[0].filename;
    }
    if (ngoMediaFiles.certificate) {
      ngo.certificate = ngoMediaFiles.certificate[0].filename;
    }

    // ✅ ולידציה בסיסית
    if (!user.email || !user.password || !user.name) {
      return res
        .status(400)
        .json({ success: false, message: "חובה למלא שם, אימייל וסיסמה" });
    }

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
    console.error("❌ שגיאה בהרשמה:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const registerExistingNgo = async (req: Request, res: Response) => {
  try {
    const { user }: { user: IUser } = req.body;

    if (!user.email || !user.password || !user.name) {
      return res
        .status(400)
        .json({ success: false, message: "חובה למלא שם, אימייל וסיסמה" });
    }

    user.approved = false;
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
    console.error("❌ שגיאה בהרשמה:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "חובה למלא אימייל וסיסמה" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "אימייל או סיסמה שגויים" });
    }

    if (!user.approved) {
      return res
        .status(400)
        .json({ success: false, message: "המשתמש ממתין לאישור מנהל" });
    }

    const ok = await AuthService.comparePassword(password, user.password);
    if (!ok) {
      return res
        .status(400)
        .json({ success: false, message: "אימייל או סיסמה שגויים" });
    }

    // ✅ בדיקה אם העמותה פעילה
    if (user.ngoId) {
      const ngo = await ngoService.getById(user.ngoId.toString());
      if (ngo && !ngo.isActive) {
        return res.status(403).json({
          success: false,
          message:
            "העמותה שלך מושהית זמנית על ידי מנהל המערכת. לא ניתן להתחבר כרגע.",
        });
      }
    }

    // ✅ שימוש בשדה roles (מערך)
    const token = AuthService.signJwt({
      sub: user._id.toString(),
      ngoId: user.ngoId ? user.ngoId.toString() : null,
      role: user.role,
    });

    const { password: pwd, ...rest } = (user as any)._doc as IUser;
    res.json({ success: true, token, user: rest });
  } catch (err: any) {
    console.error("❌ שגיאה בהתחברות:", err.message);
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
