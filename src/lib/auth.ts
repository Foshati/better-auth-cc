// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click this link to reset your password: ${url}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                .container {
                  padding: 20px;
                  max-width: 600px;
                  margin: 0 auto;
                  font-family: Arial, sans-serif;
                }
                .button {
                  background-color: #3b82f6;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 4px;
                  display: inline-block;
                  margin: 20px 0;
                }
                .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Reset Your Password</h1>
                <p>We received a request to reset your password. Click the button below to choose a new password:</p>
                <a href="${url}" class="button">Reset Password</a>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <div class="footer">
                  <p>This link will expire in 24 hours.</p>
                  <p>If the button doesn't work, copy and paste this link into your browser:</p>
                  <p>${url}</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email');
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    },
  },
});