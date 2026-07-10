import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  message: { type: String, required: true },
  toEmail: { type: String, required: true },
  actionRoute: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = model("Notification", notificationSchema);
