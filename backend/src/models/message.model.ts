import { Schema, model, Document } from 'mongoose';

export interface Message {
    authorName: string;
    text: string;
    createdBy: string;
    
}

export interface IMessage extends Document, Message {
    ngoId:{ type: Schema.Types.ObjectId, ref: 'Ngo' };
}

const messageSchema = new Schema(
  {
    authorName: { type: String, required: true, },
    text: { type: String },
    createdBy: { type: String },
    
    ngoId: { type: Schema.Types.ObjectId, ref: 'Ngo', required: true },
  },
  { timestamps: true }
);

export default model<IMessage>('Message', messageSchema);