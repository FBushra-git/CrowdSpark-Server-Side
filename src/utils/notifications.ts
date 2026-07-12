import { Notification } from "../models/notification.model.js";
import { sendEmail } from "./email.js";

export type NotificationPayload = {
  message: string;
  toEmail: string;
  actionRoute: string;
  emailSubject: string;
  emailText: string;
};

export async function createNotification(payload: NotificationPayload) {
  try {
    await Notification.create({
      message: payload.message,
      toEmail: payload.toEmail,
      actionRoute: payload.actionRoute
    });
  } catch (error) {
    console.error("Failed to save notification", error);
  }

  try {
    await sendEmail({
      to: payload.toEmail,
      subject: payload.emailSubject,
      text: payload.emailText,
      html: `<p>${payload.emailText}</p>`
    });
  } catch (error) {
    console.error("Failed to send email notification", error);
  }
}
