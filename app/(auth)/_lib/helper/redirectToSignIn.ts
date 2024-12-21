import { redirect } from "next/navigation";

export const redirectToSignIn = async (callbackUrl?: string) => {
  const signInPath = "/auth/sign-in";

  const redirectUrl = callbackUrl
    ? `${signInPath}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : signInPath;

  if (typeof window === "undefined") {
    redirect(redirectUrl);
  } else {
    window.location.href = redirectUrl;
  }
};
