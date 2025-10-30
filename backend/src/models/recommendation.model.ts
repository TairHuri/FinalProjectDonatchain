import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin'|'member';
  ngoId?: string;
  address?: string;
  phone?: string;
  bankAccount?: string;
  wallet?: string;
  goals?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
   
    ngoId: String,
    address: String,
    phone: String,
    bankAccount: String,
    wallet: String,
    goals: String
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
