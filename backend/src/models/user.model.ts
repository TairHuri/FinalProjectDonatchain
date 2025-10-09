import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  roles: string[];
  ngoId: string;
  approved:boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: String,
    roles:[String],
    ngoId: {type:String, required:true},
    approved:Boolean
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
