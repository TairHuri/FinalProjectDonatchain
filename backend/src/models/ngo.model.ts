import { Schema, model, Document } from 'mongoose';

export interface BaseNgo {
  name: string;
  ngoNumber:string;
  description: string;
  website?: string;
  bankAccount?: string;
  wallet?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  certificate: string;
}
export interface INgo extends Document, BaseNgo {
  createdBy?: Schema.Types.ObjectId|null;
  createdAt: Date;
}

const ngoSchema = new Schema(
  {
    name: { type: String, required: true, index: true, unique:true },
    ngoNumber: { type: String, unique: true },
    description: String,
    website: String,
    email: String,
    address: String,
    phone: String,
    bankAccount: String,
    wallet: String,
    logoUrl: String,
    certificate: {type: String, required:true},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default model<INgo>('Ngo', ngoSchema);
