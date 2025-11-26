import { Schema, model, Document } from 'mongoose';

// Base interface for a donation
export interface DonationIF {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  campaign: Schema.Types.ObjectId | string 
  amount: number;
  originalAmount: number;
  currency: string;
  method: string; // e.g. 'card','wallet','onchain'
  txHash?: string; // blockchain tx if onchain
  comment?: string;
  anonymous?:boolean;
}


// Mongoose document interface for a donation
export interface IDonation extends Document, DonationIF {
  createdAt: Date;
}

// Extended interface for credit card donations with payment details

export interface CreditDonation extends DonationIF {
  ccNumber: string, expYear: number, expMonth: number, cvv: number, ownerId: string, ownername: string;
}

// Mongoose schema definition for the Donation collection
const donationSchema = new Schema(
  {
    email: { type: String },
    phone: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    originalAmount: { type: Number, required: true },
    currency: { type: String, default: 'ILS' },
    method: { type: String, default: 'card' },
    txHash: { type: String },
    comment: { type: String },
    anonymous: { type: Boolean, default:false },
  },
  { timestamps: true }
);

export default model<IDonation>('Donation', donationSchema);
