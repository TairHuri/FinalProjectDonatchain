import { Schema, model, Document } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  description: string;
  ngo:  { type: Schema.Types.ObjectId, ref: 'Ngo' };
  goal: number;
  currency: string;
  raised: number;
  numOfDonors: number;
  images: string[];
  tags: string[]; // for recommendations
  blockchainTx?: string; // optional tx that created campaign on-chain
  isActive: boolean;
  createdAt: Date;
}

const campaignSchema = new Schema(
  {
    title: { type: String, required: true, index: 'text' },
    description: { type: String, required: true, index: 'text' },
    ngo: { type: Schema.Types.ObjectId, ref: 'Ngo', required: true },
    goal: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    raised: { type: Number, default: 0 },
    numOfDonors: {type: Number, default: 0},
    images: [String],
    tags: [String],
    blockchainTx: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

campaignSchema.index({ title: 'text', description: 'text', tags: 1 });

export default model<ICampaign>('Campaign', campaignSchema);
