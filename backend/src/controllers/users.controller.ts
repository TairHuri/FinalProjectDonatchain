// src/controllers/users.controller.ts
import { Request, Response } from 'express';
import User from '../models/user.model';
import * as AuthService from '../services/auth.service';
import AuditLog from '../models/auditlog.model';

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
