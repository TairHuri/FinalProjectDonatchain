// src/controllers/users.controller.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import * as AuthService from '../services/auth.service';
import AuditLog from '../models/auditlog.model';
import userService from '../services/user.service';
import { ServerError } from '../middlewares/error.middleware';
import serverMessages from '../config/serverMessages.json';
import {config} from '../config'

// Waiting time before allowing deletion of another manager (in ms)
const deleteManagerWaitingTime = config.deleteManagerWaitingTime*1000*60; 

// ---------------------------------------------
// Returns authenticated user's data (profile)
// ---------------------------------------------
export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile } });
};

// ---------------------------------------------------------------
// Allows a logged-in user to change their password
// Validates current password and encrypts the new one
// ---------------------------------------------------------------
export const changePassword = async (req: Request, res: Response) => {
  const reqUser = (req as any).user;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await userService.getById(reqUser._id)
    if (!user) {
      return res.status(401).send({ message:serverMessages.user.not_found.he})
    }
    const ok = await AuthService.comparePassword(currentPassword, user.password);
    if (!ok)
      return res.status(400).json({ success: false, message: serverMessages.user.worng_password.he});
    user.password = await AuthService.encryptPassword(newPassword.toString());
    const updatedUser = await userService.updateUser(user._id, user)

    await AuditLog.create({ action: 'user_password_changed', user: user._id });
    const { password, ...DTOUser } = (updatedUser as any)._doc
    res.json(DTOUser);
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

// ----------------------------------------------------------------------
// Update logged-in user's details (only their own profile)
// Prevents updating other users by comparing IDs
// ----------------------------------------------------------------------
export const updateMe = async (req: Request, res: Response) => {
  const reqUser = (req as any).user;
  const user: IUser = req.body;
  try {
    if (user._id != reqUser._id) {
      return res.status(403).send({ message: serverMessages.user.not_found.he })
    }
    const updatedUser = await userService.updateUser(user._id, user)

    await AuditLog.create({ action: 'user_updated', user: user._id });
    const { password, ...DTOUser } = (updatedUser as any)._doc
    res.json(DTOUser);
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

// --------------------------------------------------------
// Admin: Fetch all users (password excluded)
// --------------------------------------------------------
export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash').limit(200);
    res.json({ items: users });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------------------------------
// Admin: Fetch users belonging to a specific NGO
// --------------------------------------------------------
export const listUsersByNgo = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params
    const users = await User.find({ ngoId }).select('-password').limit(200);
    res.json({ items: users });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------------------------------
// Admin: Approve user registration
// --------------------------------------------------------
export const approveUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const updatedUser = await userService.approveUser(userId)
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "משתמש לא קיים" });
    }
    const { password, ...rest } = updatedUser
    res.json({ success: true, user: rest });
  } catch (err: any) {
    if (err instanceof ServerError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};


// --------------------------------------------------------
// Admin: Change a user's role
// --------------------------------------------------------
export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { role } = req.body;
    const updatedUser = await userService.updateRole(userId, role)
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "משתמש לא קיים" });
    }
    const { password, ...rest } = updatedUser
    res.json({ success: true, user: rest });
  } catch (err: any) {
    console.log(err)
    if (err instanceof ServerError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

// --------------------------------------------------------
// Delete a user
// Special rule: deleting a manager has a cooldown time
// --------------------------------------------------------
let lastDeletedTime:number|null = null;
export const deleteUse = async(req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await userService.getById(userId)
    if(!user){
      res.status(400).send({message:serverMessages.user.not_found.he})
      return;
    }
    if(user.role == 'manager'){
      const now = Date.now();
      if(lastDeletedTime !=null && (lastDeletedTime + deleteManagerWaitingTime > now)){
        return res.status(400).send({message:serverMessages.user.delete_timer.he})
      }
      lastDeletedTime = now;
      
    }
    await userService.deleteUser(userId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.toString() });
  }
}