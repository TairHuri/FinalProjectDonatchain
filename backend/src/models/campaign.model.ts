import { Schema, model, Document } from 'mongoose';

export interface BaseCampaign{
  title: string;
  description: string;
  ngo: { type: Schema.Types.ObjectId, ref: 'Ngo' };
  goal: number;
  raised: {crypto:number, credit:number};
  numOfDonors: number;
  startDate: string;
  endDate: string;
  images: string[];
  movie?: string;
  mainImage?: string;
  tags: string[]; 
  blockchainTx?: string; 
  isActive: boolean;
  createdAt: Date;
}
export interface ICampaign extends Document, BaseCampaign {
  
}
export interface ICampaignWithTotal extends BaseCampaign{
  totalRaised:number;
  _id?:string;
}

const campaignSchema = new Schema(
  {
    title: { type: String, required: true, index: 'text' },
    description: { type: String, required: true, index: 'text' },
    ngo: { type: Schema.Types.ObjectId, ref: 'Ngo', required: true },
    goal: { type: Number, required: true },
    raised: {crypto:{ type: Number, default: 0 }, credit:{ type: Number, default: 0 }},
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
