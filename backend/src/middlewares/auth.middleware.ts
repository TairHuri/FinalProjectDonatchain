import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import User from '../models/user.model';

export default async function (req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload: any = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
