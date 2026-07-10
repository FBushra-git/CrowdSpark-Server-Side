import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, default: "" },
  authProvider: { type: String, enum: ["credentials", "google"], default: "credentials" },
  photoUrl: { type: String, required: true },
  role: { type: String, enum: ["supporter", "creator", "admin"], default: "supporter" },
  credits: { type: Number, default: 50 },
  raisedCredits: { type: Number, default: 0 }
}, { timestamps: true });

export const User = model("User", userSchema);
