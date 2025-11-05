import { Schema, model, Document } from 'mongoose';

export type RequestStatusType = 'pending'|'inprogress'|'done';
export type RequestCategoryType = 'account'|'general'|'permissions'|'campaigns'|'support'|'suggestions'

export interface AdminRequestByUser
  {
  subject: string;
  body: string;
  category: RequestCategoryType;
  userId:string;
  status:RequestStatusType;
  adminComment:string;
};


export interface IAdminRequestByUser extends Document, AdminRequestByUser {
    ngoId:{ type: Schema.Types.ObjectId, ref: 'Ngo' };
}

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