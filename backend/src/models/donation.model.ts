import { Schema, model, Document } from 'mongoose';

export interface DonationIF {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  campaign: Schema.Types.ObjectId | string;
  amount: number;
  currency: string;
  method: string; // e.g. 'card','wallet','onchain'
  txHash?: string; // blockchain tx if onchain
  comment?: string;
  anonymous?:boolean;
}

export interface IDonation extends Document, DonationIF {
  createdAt: Date;
}

export interface CreditDonation extends DonationIF {
  ccNumber: string, expYear: number, expMonth: number, cvv: number, ownerId: string, ownername: string;
}

const donationSchema = new Schema(
  {
    email: { type: String },
    phone: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'ILS' },
    method: { type: String, default: 'card' },
    txHash: { type: String },
    comment: { type: String },
    anonymous: { type: Boolean, default:false },
  },
  { timestamps: true }
);

export default model<IDonation>('Donation', donationSchema);
