import { Request, Response, NextFunction } from 'express';

export default function(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const has = user.roles.some((r: string) => allowedRoles.includes(r));
    if (!has) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
