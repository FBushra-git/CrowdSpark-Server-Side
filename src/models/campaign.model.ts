import { Schema, model } from "mongoose";

const campaignSchema = new Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  category: { type: String, required: true },
  fundingGoal: { type: Number, required: true },
  minimumContribution: { type: Number, required: true },
  deadline: { type: Date, required: true },
  rewardInfo: { type: String, required: true },
  imageUrl: { type: String, required: true },
  amountRaised: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "approved", "rejected", "suspended"], default: "pending" },
  creatorName: { type: String, required: true },
  creatorEmail: { type: String, required: true }
}, { timestamps: true });

export const Campaign = model("Campaign", campaignSchema);
