import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '../auth';

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export const redirectToSignIn = (callbackUrl?: string) => {
  const signInPath = '/auth/sign-in';

  const redirectUrl = callbackUrl ? `${signInPath}?callbackUrl=${encodeURIComponent(callbackUrl)}` : signInPath;

  if (typeof window === 'undefined') {
    redirect(redirectUrl);
  } else {
    window.location.href = redirectUrl;
  }
};
