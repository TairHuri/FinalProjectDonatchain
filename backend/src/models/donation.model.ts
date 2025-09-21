import { Schema, model, Document } from 'mongoose';

export interface IDonation extends Document {
  donor: Schema.Types.ObjectId | null;
  campaign: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  method: string; // e.g. 'card','wallet','onchain'
  txHash?: string; // blockchain tx if onchain
  createdAt: Date;
}

const donationSchema = new Schema(
  {
    donor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    method: { type: String, default: 'card' },
    txHash: String
  },
  { timestamps: true }
);

export default model<IDonation>('Donation', donationSchema);
