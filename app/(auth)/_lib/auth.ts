import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "@/app/(auth)/_actions/email";
import { openAPI } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import { username } from "better-auth/plugins";
import db from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your password",
          text: `Click the link to reset your password: ${url}`,
          html: `
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${url}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
          `,
        });
      } catch (error) {
        console.error("Failed to send password reset email:", error);
      }
    },
  },
  
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      try {
        const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
        
        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email: ${verificationUrl}`,
          html: `
            <h2>Email Verification</h2>
            <p>Click the link below to verify your email address:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
          `,
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  
  user: {
    additionalFields: {
      premium: {
        type: "boolean",
        required: false,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        try {
          await sendEmail({
            to: newEmail,
            subject: "Verify your email change",
            text: `Click the link to verify: ${url}`,
            html: `
              <p>You requested to change your email. Click the link to verify:</p>
              <a href="${url}">Verify Email Change</a>
              <p>If you did not request this, please contact support.</p>
            `,
          });
        } catch (error) {
          console.error("Failed to send email change verification:", error);
        }
      },
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
  },

  trustedOrigins: [
    "https://foshati22.liara.run/api/auth",
    "https://foshati22.liara.run/sign-in",
    "https://foshati22.liara.run/sign-up",
    "https://foshati22.liara.run/forgot-password",
    "https://foshati22.liara.run",
    "https://0.0.0.0:3000",
    "http://localhost:3000",
  ],
  
  plugins: [
    username(),
    openAPI(),
    admin({
      impersonationSessionDuration: 60 * 60 * 24 * 7, // 7 days
    }),
  ],
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;