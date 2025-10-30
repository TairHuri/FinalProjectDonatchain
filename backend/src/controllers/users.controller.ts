// src/controllers/users.controller.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import * as AuthService from '../services/auth.service';
import AuditLog from '../models/auditlog.model';
import userService from '../services/user.service';
import { ServerError } from '../middlewares/error.middleware';
import { log } from 'console';

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile } });
};

export const updateMe = async (req: Request, res: Response) => {
  const reqUser = (req as any).user;
  const user:IUser = req.body;
  try {
    if(user._id != reqUser._id){
      return res.status(403).send({message:'cannot update other user'})
    }
    const updatedUser = await userService.updateUser(user._id, user)
    
    await AuditLog.create({ action: 'user_updated', user: user._id });
    const {password, ...DTOUser} = (updatedUser as any)._doc
    res.json(DTOUser);
  } catch (err: any) {
    res.status(err.statusCode||400).json({ message: err.message });
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
    if(err instanceof ServerError){
      res.status(err.statusCode).json({ message: err.message });
    }else{
      res.status(500).json({success:false, message: err.message });
    }
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const {userId} = req.params
    const {role} = req.body;
          console.log('role', req.body);
    const updatedUser = await userService.updateRole(userId, role)
    if(!updatedUser){
      return res.status(404).json({ success: false, message:"משתמש לא קיים" });
    }
    const {password, ...rest} = updatedUser
    res.json({ success:true, user:rest });
  } catch (err: any) {
    console.log(err)
    if(err instanceof ServerError){
      res.status(err.statusCode).json({ message: err.message });
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