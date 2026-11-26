import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.findOneAndUpdate(
      { email: "admin@fitzone.com" },
      {
        password: hashedPassword,
        role: "admin",
        status: "active",
      },
      { new: true }
    );

    if (!admin) {
      console.log("Admin not found");
      process.exit(1);
    }

    console.log("Admin password updated successfully");
    console.log("Email: admin@fitzone.com");
    console.log("Password: Admin@123");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

resetAdminPassword();