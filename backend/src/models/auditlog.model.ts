import { Schema, model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  meta?: any;
  user?: Schema.Types.ObjectId;
  createdAt: Date;
}

const auditSchema = new Schema(
  {
    action: { type: String, required: true },
    meta: Schema.Types.Mixed,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default model<IAuditLog>('AuditLog', auditSchema);
