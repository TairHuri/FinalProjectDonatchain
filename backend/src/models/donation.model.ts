import { Schema, model, Document } from 'mongoose';

export interface IDonation extends Document {
  email:string;
  phone:string;
  firstName: string;
  lastName: string;
  campaign: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  method: string; // e.g. 'card','wallet','onchain'
  txHash?: string; // blockchain tx if onchain
  createdAt: Date;
}

const donationSchema = new Schema(
  {
    email:{type:String},
    phone:{type:String},
    firstName:{type:String},
    lastName:{type:String},
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'ILS' },
    method: { type: String, default: 'card' },
    txHash: String
  },
  { timestamps: true }
);

export default model<IDonation>('Donation', donationSchema);
