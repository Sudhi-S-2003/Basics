import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  otp: String, // Store OTP temporarily
  image: String,
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
