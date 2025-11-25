import { Request, Response, NextFunction } from 'express';

export default function(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    //user.roles = ['ngo']
    const has = allowedRoles.includes(user.role);
    if (!has) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
