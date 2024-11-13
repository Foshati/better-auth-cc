import { createAuthClient } from "better-auth/client";
const client = createAuthClient();

export const signin = async () => {
  try {
    await client.signIn.social({
      provider: "github",
    });
  } catch (error) {
    console.error("Github error", error);
  }
};



