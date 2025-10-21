import { Schema, model, Document } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  description: string;
  ngo: { type: Schema.Types.ObjectId, ref: 'Ngo' };
  goal: number;
  currency: string;
  raised: number;
  numOfDonors: number;
  startDate: string;
  endDate: string;
  images: string[];
  movie?: string;
  mainImage?: string;
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
    numOfDonors: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    images: [String],
    movie: { type: String },
    mainImage: { type: String },
    tags: [String],
    blockchainTx: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

campaignSchema.index({ title: 'text', description: 'text', tags: 1 });

export default model<ICampaign>('Campaign', campaignSchema);
