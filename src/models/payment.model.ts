import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  credits: { type: Number, required: true },
  amount: { type: Number, required: true },
  provider: { type: String, default: "stripe" },
  packageId: { type: String },
  paymentMethod: { type: String, default: "stripe" },
  description: { type: String },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "paid" }
}, { timestamps: true });

export const Payment = model("Payment", paymentSchema);
