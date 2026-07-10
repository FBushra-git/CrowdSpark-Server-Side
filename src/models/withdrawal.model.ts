import { Schema, model } from "mongoose";

const withdrawalSchema = new Schema({
  creatorEmail: { type: String, required: true },
  creatorName: { type: String, required: true },
  withdrawalCredit: { type: Number, required: true },
  withdrawalAmount: { type: Number, required: true },
  paymentSystem: { type: String, required: true },
  accountNumber: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

export const Withdrawal = model("Withdrawal", withdrawalSchema);
