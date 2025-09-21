// src/types/express.d.ts
import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export {};
