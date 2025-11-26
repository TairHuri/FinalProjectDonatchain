import { Schema, model, Document } from 'mongoose';

// Define the possible statuses for an admin request.
export type RequestStatusType = 'pending' | 'inprogress' | 'done';

// Define the possible categories for an admin request.
export type RequestCategoryType = 'account' | 'general' | 'permissions' | 'campaigns' | 'support' | 'suggestions'

// Interface representing the structure of a user request to the admin.
export interface AdminRequestByUser
  {
  subject: string;
  body: string;
  category: RequestCategoryType;
  userId:string;
  status:RequestStatusType;
  adminComment:string;
};

// Interface for Mongoose Document, combining the AdminRequestByUser properties
// and adding a reference to the NGO that the request is associated with.
export interface IAdminRequestByUser extends Document, AdminRequestByUser {
    ngoId:{ type: Schema.Types.ObjectId, ref: 'Ngo' };
}

// Define the Mongoose schema for storing admin requests in MongoDB.
const adminRequestSchema = new Schema(
  { 
    subject: { type: String },
    body: { type: String },
    userId: { type: String },
    status: { type: String, enum:['pending', 'inprogress', 'done'] },
    category: { type: String, enum:['account','general','permissions','campaigns','support','suggestions'] },
    adminComment: { type: String },
    ngoId: { type: Schema.Types.ObjectId, ref: 'Ngo', required: true },
  },
  { timestamps: true }
);

export default model<IAdminRequestByUser>('AdminRequestByUser', adminRequestSchema);