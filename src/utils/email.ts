import axios from "axios";

export type SendEmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || "no-reply@crowdspark.dev";
  if (!apiKey) {
    console.warn("SENDGRID_API_KEY is not configured. Email notification skipped.");
    return;
  }

  await axios.post(
    "https://api.sendgrid.com/v3/mail/send",
    {
      personalizations: [{ to: [{ email: to }], subject }],
      from: { email: fromEmail, name: "CrowdSpark" },
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html || `<p>${text}</p>` }
      ]
    },
    { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
  );
}
