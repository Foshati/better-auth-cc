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
  // Validate environment configuration
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPortString = process.env.SMTP_PORT || '0';

  // Parse and validate port
  const smtpPort = parseInt(smtpPortString, 10);
  if (!smtpHost || !smtpUser || !smtpPass || isNaN(smtpPort) || smtpPort <= 0) {
    throw new Error('Invalid or missing SMTP configuration');
  }

  // Determine environment
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Log partial credentials for debugging (in development)
  if (isDevelopment) {
    console.log('SMTP Configuration:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser?.substring(0, 3) + '***'
    });
  }

  try {
    // Create transporter with comprehensive options
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true, // Use secure connection for SSL/TLS
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      // Enhanced connection settings
      connectionTimeout: 10000,  // 10 seconds
      greetingTimeout: 10000,    // 10 seconds
      socketTimeout: 20000,      // 20 seconds
      logger: isDevelopment,     // Enable logging only in development
      debug: isDevelopment       // Enable debug in development
    });

    // Verify SMTP connection
    await transporter.verify();

    // Prepare email details
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Your App" <noreply@yourapp.com>',
      to,
      subject,
      text,
      html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log successful email transmission
    if (isDevelopment) {
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      });
    }

    return info;
  } catch (error) {
    // Comprehensive error logging
    console.error('Email Transmission Error:', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });

    // Throw a detailed error
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown SMTP error'}`);
  }
}