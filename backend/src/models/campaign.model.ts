// campaign.model.ts
import { Schema, model, Document, Types } from 'mongoose';
interface ICampaign extends Document {
  title: string;
  description: string;
  ngo: Types.ObjectId;
  targetAmount: number;
  goal?: number;          // ← שדה חדש
  currency: string;
  raised: number;
  images: string[];
  tags: string[];
  video?: string;
  ngoLogo?: string;
  blockchainTx?: string;
  isActive: boolean;
  createdAt: Date;
}

const campaignSchema = new Schema(
  {
    title: { type: String, required: true, index: 'text' },
    description: { type: String, required: true, index: 'text' },
    ngo: { type: Schema.Types.ObjectId, ref: 'Ngo', required: true },
    targetAmount: { type: Number, required: true },
    goal: { type: Number },            // ← שדה חדש
    currency: { type: String, default: 'USD' },
    raised: { type: Number, default: 0 },
    images: [String],
    video: { type: String },
    ngoLogo: { type: String },
    tags: [String],
    blockchainTx: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


campaignSchema.index({ title: 'text', description: 'text', tags: 1 });

export default model<ICampaign>('Campaign', campaignSchema);
