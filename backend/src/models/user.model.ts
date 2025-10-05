import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  roles: string[];
  ngoId?: string;
  phone?: string;
  approved:boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    phone: String,
    roles:[String],
    ngoId: {type:String, required:false},
    approved:Boolean
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
