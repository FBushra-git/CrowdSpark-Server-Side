import { Schema, model } from "mongoose";

const reportSchema = new Schema({
  campaignId: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
  campaignTitle: { type: String, required: true },
  reporterName: { type: String, required: true },
  reporterEmail: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["open", "resolved"], default: "open" }
}, { timestamps: true });

export const Report = model("Report", reportSchema);
