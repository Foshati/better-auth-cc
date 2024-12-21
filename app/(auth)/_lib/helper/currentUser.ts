import { auth } from "@/app/(auth)/_lib/auth";
import { headers } from "next/headers";
import { cache } from 'react';

interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  premium?: boolean | null;
  username?: string | null;
  banned: boolean | null;
  role?: string | null;
  banReason?: string | null;
  banExpires?: Date | null;
}

// Use React's cache function for more efficient memoization
export const currentUser = cache(async (): Promise<User | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    // Type assertion to ensure type safety
    return session.user as User;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
});

// Helper function to check if user has specific role
export const hasRole = async (role: string): Promise<boolean> => {
  const user = await currentUser();
  return user?.role === role;
};

// Helper function to check if user is premium
export const isPremium = async (): Promise<boolean> => {
  const user = await currentUser();
  return !!user?.premium;
};

// Helper function to check if user is banned
export const isBanned = async (): Promise<boolean> => {
  const user = await currentUser();
  if (!user?.banned) return false;
  
  // Check if ban has expired
  if (user.banExpires && new Date(user.banExpires) < new Date()) {
    return false;
  }
  return true;
};