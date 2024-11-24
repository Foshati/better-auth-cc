import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST, // از محیط بارگذاری شود
      port: parseInt(process.env.MAILTRAP_PORT || "2525"),
      auth: {
        user: process.env.MAILTRAP_USER, // یوزرنیم Mailtrap
        pass: process.env.MAILTRAP_PASS, // پسورد Mailtrap
      },
    });

    const info = await transporter.sendMail({
      from: `"Your App" <no-reply@yourapp.com>`, // ارسال‌کننده
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
};
