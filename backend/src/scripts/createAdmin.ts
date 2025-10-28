// backend/src/scripts/createAdmin.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model"; 
dotenv.config();

//  קריאת משתנה הסביבה עם כתובת MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/donatchain";

async function createAdmin() {
  try {
    // התחברות למסד הנתונים
    await mongoose.connect(mongoUri);
    console.log(" Connected to MongoDB");

    const email = "admin@donatchain.com";
    const password = "Admin123!";
    const hashedPassword = await bcrypt.hash(password, 10);

    // בדיקה אם האדמין כבר קיים
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin user already exists!");
      return;
    }

    //  יצירת המשתמש עם שדה name הנכון
    const adminUser = new User({
      name: "System Admin",
      email,
      password: hashedPassword,
      roles: ["admin"],
      approved: true,
    });

    await adminUser.save();
    console.log(" Admin user created successfully!");
    console.log(` Email: ${email}`);
    console.log(` Password: ${password}`);
  } catch (error) {
    console.error(" Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log(" Disconnected from MongoDB");
  }
}

// הפעלת הפונקציה
createAdmin();
