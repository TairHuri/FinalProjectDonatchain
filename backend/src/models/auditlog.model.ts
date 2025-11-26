import { Schema, model, Document } from 'mongoose';

// Interface representing the structure of an Audit Log document in MongoDB
export interface IAuditLog extends Document {
  action: string;                  // Description of the action performed (e.g., "user_created")
  meta?: any;                      // Optional metadata, can store any additional info related to the action
  user?: Schema.Types.ObjectId;    // Optional reference to the user who performed the action
  createdAt: Date;                 // Timestamp for when the action was logged (added automatically by timestamps)
}

// Define the Mongoose schema for the audit log
const auditSchema = new Schema(
  {
    action: { type: String, required: true },
    meta: Schema.Types.Mixed,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default model<IAuditLog>('AuditLog', auditSchema);
