// src/actions/email.ts
import nodemailer from 'nodemailer';

export async function sendEmail({
  to,
  subject,
  text,
  html
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  // Log the credentials to verify they're being read
  console.log('Liara SMTP Credentials:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER?.substring(0, 3) + '***', // Partial logging for security
  });

  try {
    // Ensure credentials are present
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials are missing');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // Use secure connection for Liara's SMTP (SSL/TLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      // Additional connection options
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 20000,     // 20 seconds
      logger: true,             // Enable logging
      debug: process.env.NODE_ENV !== 'production' // Enable debug in non-production
    });

    // Verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('SMTP Connection Verification Failed:', error);
          reject(error);
        } else {
          console.log('SMTP Connection is ready');
          resolve(success);
        }
      });
    });

    // Send email with comprehensive logging
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Your App" <noreply@yourapp.com>',
      to,
      subject,
      text,
      html
    });

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response
    });

    return info;
  } catch (error) {
    // Comprehensive error logging
    console.error('Detailed email send error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });

    // Throw a more informative error
    throw new Error(`Email could not be sent: ${error instanceof Error ? error.message : 'Unknown SMTP error'}`);
  }
}