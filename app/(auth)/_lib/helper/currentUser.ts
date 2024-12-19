import { auth } from "@/app/(auth)/_lib/auth";
import { headers } from "next/headers";

let cachedUser: {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined | undefined;
  premium?: boolean | null | undefined;
  username?: string | null | undefined;
  banned: boolean | null | undefined;
  role?: string | null | undefined;
  banReason?: string | null | undefined;
  banExpires?: Date | null | undefined;
} | null = null; // Cache the user to avoid redundant API calls

export async function currentUser() {
  if (cachedUser) {
    return cachedUser; // Return the cached user if available
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return null; // Return null if no user session exists
  }

  cachedUser = session.user; // Cache the user data
  return cachedUser;
}
