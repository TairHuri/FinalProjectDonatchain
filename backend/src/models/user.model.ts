import { Schema, model, Document } from 'mongoose';
import { INgo } from './ngo.model';

// ✅ הגדרת כל סוגי התפקידים האפשריים
export type UserRoleType = 'admin' | 'ngo' | 'donor' | 'member';

export interface IUser extends Document {
  ngo?: INgo;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRoleType;
  ngoId?: Schema.Types.ObjectId; // ✅ לא חובה
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  resetCode?: string;
resetCodeExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    resetCode: { type: String },
resetCodeExpires: { type: Date },

    //  תמיכה בכל סוגי המשתמשים + ברירת מחדל member
    role: { 
      type: String, 
      enum: ['admin', 'ngo', 'donor', 'member'], 
      default: 'member', 
      required: true 
    },

    //  מנהל מערכת לא חייב עמותה
    ngoId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Ngo', 
      required: false 
    },

    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
