import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import {config} from '../config'


const mongoUri = config.mongoUri;

export async function createAdmin() {
  try {
    const email = config.adminEmail;
    const password = config.adminPassword;

    if(email.length == 0){
      console.error("Admin email is missing or invalid - stopping server");
      process.exit(1);
    }
    if(password.length == 0){
      console.error("Admin password is missing or invalid - stopping server");
      process.exit(1);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "admin",
      approved: true,

    });
    await adminUser.save();
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

if (require.main === module) {
  mongoose
    .connect(mongoUri)
    .then(async () => {
      await createAdmin();
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}
