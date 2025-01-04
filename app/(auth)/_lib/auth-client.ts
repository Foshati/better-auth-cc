import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { usernameClient } from "better-auth/client/plugins";

const authBaseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  trustedOrigins: [
    authBaseUrl,
    `${authBaseUrl}/api/auth`,
    `${authBaseUrl}/sign-in`,
    `${authBaseUrl}/sign-up`,
    `${authBaseUrl}/forgot-password`,
    `${authBaseUrl}/reset-password`,
    "http://localhost:3000",
    "https://0.0.0.0:3000"
  ],
  plugins: [adminClient(), usernameClient()],
});