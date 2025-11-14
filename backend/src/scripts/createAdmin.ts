import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/donatchain";

export async function createAdmin() {
  try {
    console.log("🔄 Checking for admin user...");
    const email = "admin@donatchain.com";
    const password = "Admin123!";

    // בדיקה אם כבר יש אדמין
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin user already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "admin",
      approved: true,
      ngoId: new mongoose.Types.ObjectId(),
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
}

// הפונקציה תרוץ רק אם הקובץ מורץ ישירות (npm run create-admin)
if (require.main === module) {
  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log("✅ Connected to MongoDB");
      await createAdmin();
    })
    .finally(async () => {
      await mongoose.disconnect();
      console.log("🔌 Disconnected from MongoDB");
    });
}
