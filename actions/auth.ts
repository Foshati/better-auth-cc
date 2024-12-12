// lib/actions/auth.ts

import prisma from "@/lib/prisma";


export async function checkUsernameAvailability(username: string) {
  try {
    // Remove @ if present and trim
    const cleanUsername = username.replace(/^@/, '').trim();

    // Check if username exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { 
        username: cleanUsername 
      },
      select: { 
        id: true 
      }
    });

    return {
      available: !existingUser,
      username: cleanUsername
    };
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw new Error("Failed to check username availability");
  }
}

// Add this to your authClient
export const authClient = {
  // ... other methods
  checkUsername: checkUsernameAvailability
};