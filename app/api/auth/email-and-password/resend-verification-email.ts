// /api/auth/email-and-password/resend-verification-email.ts

import { sendEmail } from "@/actions/email";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" }); // ارسال پاسخ JSON در صورت درخواست نادرست
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" }); // ارسال پاسخ JSON در صورت نبود ایمیل
  }

  try {
    const subject = "Verify your email address";
    const verificationLink = `${process.env.APP_URL}/verify-email?email=${encodeURIComponent(email)}`;
    const html = `<p>Please verify your email by clicking the link below:</p>
                  <a href="${verificationLink}">Verify Email</a>`;

    // ارسال ایمیل با تابع sendEmail
    await sendEmail({
      to: email,
      subject,
      html,
    });

    return res.status(200).json({ message: "Verification email sent successfully" }); // پاسخ موفقیت‌آمیز
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send verification email. Please try again later." }); // پاسخ خطا
  }
}
