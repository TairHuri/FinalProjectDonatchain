import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import User from "../models/user.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, ngoId, address, phone, bankAccount, wallet, goals } = req.body;

    // ✅ ולידציה בסיסית לפני שמנסים ליצור משתמש
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "חובה למלא שם, אימייל וסיסמה" });
    }

    const user = await AuthService.registerUser({
      email,
      password,
      name,
      ngoId,
      address,
      phone,
      bankAccount,
      wallet,
      goals,
    });

    const token = AuthService.signJwt({ sub: user._id.toString() });
res.status(201).json({
  success: true,
  message: "עמותה נרשמה בהצלחה",
  user: { 
    id: user._id, 
    email: user.email, 
    name: user.name,
    ngoId: user.ngoId,       // ✅ נוסיף מספר עמותה
    phone: user.phone,       // ✅ נוסיף טלפון
    address: user.address,
    bankAccount: user.bankAccount,
    wallet: user.wallet,
    goals: user.goals,
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
      return res.status(400).json({ success: false, message: "חובה למלא אימייל וסיסמה" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "אימייל או סיסמה שגויים" });
    }

    const ok = await AuthService.comparePassword(password, (user as any).passwordHash);
    if (!ok) {
      return res.status(400).json({ success: false, message: "אימייל או סיסמה שגויים" });
    }

    const token = AuthService.signJwt({ sub: user._id.toString() });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        ngoId: user.ngoId,
        phone: user.phone,
        address: user.address,
        bankAccount: user.bankAccount,
        wallet: user.wallet,
        goals: user.goals,
      },
    });
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
      ngoId: user.ngoId,   // ✅
      phone: user.phone, 
      name: user.name,
      roles: user.roles,
    },
  });
};
