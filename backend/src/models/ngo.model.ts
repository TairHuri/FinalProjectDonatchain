import { Schema, model, Document } from 'mongoose';

export interface INgo extends Document {
  name: string;
  description: string;
  website?: string;
  contactEmail?: string;
  logoUrl?: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
}

const ngoSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: String,
    website: String,
    contactEmail: String,
    logoUrl: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default model<INgo>('Ngo', ngoSchema);
