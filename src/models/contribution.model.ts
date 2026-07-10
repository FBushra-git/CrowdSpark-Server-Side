import { Schema, model } from "mongoose";

const contributionSchema = new Schema({
  campaignId: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
  campaignTitle: { type: String, required: true },
  contributionAmount: { type: Number, required: true },
  supporterEmail: { type: String, required: true },
  supporterName: { type: String, required: true },
  creatorName: { type: String, required: true },
  creatorEmail: { type: String, required: true },
  message: { type: String, default: "" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

export const Contribution = model("Contribution", contributionSchema);
