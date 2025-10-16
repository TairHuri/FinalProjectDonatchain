// src/controllers/users.controller.ts
import { Request, Response } from 'express';
import User from '../models/user.model';
import * as AuthService from '../services/auth.service';
import AuditLog from '../models/auditlog.model';
import userService from '../services/user.service';

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ user: { id: user._id, name: user.name, email: user.email, roles: user.roles, profile: user.profile } });
};

export const updateMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, profile } = req.body;
  try {
    if (name) user.name = name;
    if (profile) user.profile = { ...user.profile, ...profile };
    await user.save();
    await AuditLog.create({ action: 'user_updated', user: user._id });
    res.json({ user: { id: user._id, name: user.name, email: user.email, roles: user.roles, profile: user.profile } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// admin-only
export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash').limit(200);
    res.json({ items: users });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listUsersByNgo = async (req: Request, res: Response) => {
  try {
    const {ngoId} = req.params
    const users = await User.find({ngoId}).select('-password').limit(200);
    res.json({ items: users });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const approveUser = async (req: Request, res: Response) => {
  try {
    const {userId} = req.params
    const updatedUser = await userService.approveUser(userId)
    if(!updatedUser){
      return res.status(404).json({ success: false, message:"משתמש לא קיים" });
    }
    const {password, ...rest} = updatedUser
    res.json({ success:true, user:rest });
  } catch (err: any) {
    if(err instanceof AppError){
      res.status(err.httpCode).json({ message: err.message });
    }else{
      res.status(500).json({success:false, message: err.message });
    }
  }
};

export const deleteUse = (req: Request, res: Response) =>{
  try{
    const {userId} = req.params
    userService.deleteUser(userId);
    res.json({ success:true });
  }catch(error:any){
    res.status(500).json({success:false,  message: error.toString() });
  }
}

export class AppError extends Error{
  httpCode:number;
  constructor(message:string, httpCode:number){
    super(message);
    this.httpCode = httpCode;
  }
}