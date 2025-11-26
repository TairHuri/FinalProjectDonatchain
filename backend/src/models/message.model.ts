import { Schema, model, Document } from 'mongoose';


// Base interface for a message
export interface Message {
    authorName: string;          // Name of the author of the message
    text: string;                // Message content
    createdBy: string;           // ID of the user who created the message
}

// Mongoose document interface for a message
export interface IMessage extends Document, Message {
    ngoId:{ type: Schema.Types.ObjectId, ref: 'Ngo' };
}

// Mongoose schema definition for the Message collection
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