import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import ngoService from '../services/ngo.service'
import User, { IUser } from "../models/user.model";
import { INgo } from "../models/ngo.model";

export const registerNewNgo = async (req: Request, res: Response) => {
  try {
    const { user, ngo }:{user:IUser, ngo: INgo} = req.body;

    // ✅ ולידציה בסיסית לפני שמנסים ליצור משתמש
    if (!user.email || !user.password || !user.name) {
      return res.status(400).json({ success: false, message: "חובה למלא שם, אימייל וסיסמה" });
    }
    ngo.createdBy = null;
    const createdNgo = await ngoService.create(ngo)
    user.ngoId = createdNgo._id
    
    user.approved=true;
    const createdUser = await AuthService.registerUser(user);

    createdNgo.createdBy = createdUser._id;
    await ngoService.update(createdNgo._id, createdNgo);

    const token = AuthService.signJwt({ sub: createdUser._id.toString() });

    res.status(201).json({
      success: true,
      message: "רישום התבצע בהצלחה",
      user: { id: createdUser._id, email: createdUser.email, name: createdUser.name },
      token,
    });
  } catch (err: any) {
    console.error("❌ שגיאה בהרשמה:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
export const registerExistingNgo = async (req: Request, res: Response) => {
  try {
    const { user }:{user:IUser} = req.body;

    // ✅ ולידציה בסיסית לפני שמנסים ליצור משתמש
    if (!user.email || !user.password || !user.name) {
      return res.status(400).json({ success: false, message: "חובה למלא שם, אימייל וסיסמה" });
    }

    user.approved=false;
    const createdUser = await AuthService.registerUser(user);

    const token = AuthService.signJwt({ user: createdUser._id.toString() });

    res.status(201).json({
      success: true,
      message: "משתמש נרשמה בהצלחה",
      user: { id: createdUser._id, email: createdUser.email, name: createdUser.name },
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

    if(!user.approved){
      return res.status(400).json({ success: false, message: "משתמש ממתין לאישור" });
    }
    const ok = await AuthService.comparePassword(password, user.password);
    if (!ok) {
      return res.status(400).json({ success: false, message: "אימייל או סיסמה שגויים" });
    }
    

    const token = AuthService.signJwt({ sub: user._id.toString() });
    const {password:pwd, ...rest} = (user as any)._doc as IUser;
    res.json({ success: true, token, user: rest});
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
      roles: user.roles,
    },
  });
};
