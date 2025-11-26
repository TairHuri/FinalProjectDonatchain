// src/models/ngo.model.ts
import { Schema, model, Document } from "mongoose";

// Base interface for NGO data
export interface BaseNgo {
  name: string;
  ngoNumber?: string;
  description: string;
  website?: string;
  bankAccount?: string;
  wallet?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  certificate: string;
  tags: string[];
}

// Mongoose document interface for an NGO
export interface INgo extends Document, BaseNgo {
  createdBy?: Schema.Types.ObjectId | null;
  createdAt: Date;
  isActive: boolean;
}

// Mongoose schema definition for the NGO collection
const ngoSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    ngoNumber: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    website: String,
    email: String,
    address: String,
    phone: String,
    bankAccount: String,
    wallet: String,
    logoUrl: String,
    tags: [String],
    certificate: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<INgo>("Ngo", ngoSchema);
