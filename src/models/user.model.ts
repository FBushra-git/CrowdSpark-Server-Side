import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  photoUrl: { type: String, required: true },
  role: { type: String, enum: ["supporter", "creator", "admin"], default: "supporter" },
  credits: { type: Number, default: 50 },
  raisedCredits: { type: Number, default: 0 }
}, { timestamps: true });

export const User = model("User", userSchema);
