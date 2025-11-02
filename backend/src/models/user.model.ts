import { Schema, model, Document } from 'mongoose';
import { INgo } from './ngo.model';

export type UserRoleType = 'admin'|'manager'|'member';
export interface IUser extends Document {
  ngo?: INgo;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRoleType;
  ngoId?: Schema.Types.ObjectId; 
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  resetCode?: string;
resetCodeExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    resetCode: { type: String },
resetCodeExpires: { type: Date },

    role: { 
      type: String, 
      enum: ['admin', 'manager', 'member'], 
      default: 'member', 
      required: true 
    },

    ngoId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Ngo', 
      required: false 
    },

    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
