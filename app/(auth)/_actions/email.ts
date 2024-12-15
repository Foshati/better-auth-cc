import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  // Validate environment configuration
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPortString = process.env.SMTP_PORT || "0";

  // Parse and validate port
  const smtpPort = parseInt(smtpPortString, 10);
  if (!smtpHost || !smtpUser || !smtpPass || isNaN(smtpPort) || smtpPort <= 0) {
    throw new Error("Invalid or missing SMTP configuration");
  }

  // Determine environment
  const isDevelopment = process.env.NODE_ENV !== "production";

  // Log partial credentials for debugging (in development)
  if (isDevelopment) {
    console.log("SMTP Configuration:", {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser?.substring(0, 3) + "***",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // Important: Use secure only for port 465
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // Add retry mechanism
      pool: true, // Use connection pooling
      maxConnections: 5,
      rateDelta: 1000, // 1 second
      rateLimit: 5, // 5 emails per delta
      connectionTimeout: 10000,
      socketTimeout: 20000,
    });

    // Add retry logic
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        await transporter.verify();

        const mailOptions = {
          from: process.env.EMAIL_FROM || '"Your App" <noreply@yourapp.com>',
          to,
          subject,
          text,
          html,
        };

        const info = await transporter.sendMail(mailOptions);

        return info;
      } catch (retryError) {
        retryCount++;
        console.warn(`Email send attempt ${retryCount} failed:`, retryError);

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000 * retryCount));
      }
    }

    throw new Error("Failed to send email after maximum retries");
  } catch (error) {
    console.error("Comprehensive Email Transmission Error:", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });

    throw new Error(
      `Failed to send email: ${
        error instanceof Error ? error.message : "Unknown SMTP error"
      }`
    );
  }
}
