// client.ts
import { createAuthClient } from "better-auth/client";

const client = createAuthClient();

export const signinGithub = async () => {
  try {
    await client.signIn.social({
      provider: "github",
    });
  } catch (error) {
    console.error("Github signin error:", error);
  }
};

export const signinGoogle = async () => {
  try {
    await client.signIn.social({
      provider: "google",
    });
  } catch (error) {
    console.error("Google signin error:", error);
  }
};

export const signinMicrosoft = async () => {
  try {
    await client.signIn.social({
      provider: "microsoft",
    });
  } catch (error) {
    console.error("Microsoft signin error:", error);
  }
};

export const signinTwitter = async () => {
  try {
    await client.signIn.social({
      provider: "twitter",
    });
  } catch (error) {
    console.error("Twitter signin error:", error);
  }
};
