import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const usernameSchema = 
z
.string()
.min(5, "❌ Username must be at least 5 characters long.") // Include @ in the length
.max(21, "❌ Username must be less than 21 characters.") // Include @ in the length

.regex(
  /^(?!.*\.\.)[a-zA-Z0-9._]+$/,
  "❌ Username cannot contain consecutive dots." // Ensure no consecutive dots
);


export async function GET(request: NextRequest) {
  const baseName = request.nextUrl.searchParams.get("baseName");

  if (!baseName) {
    return NextResponse.json(
      { error: "Base name is required." },
      { status: 400 }
    );
  }

  const validBaseName = baseName.toLowerCase().replace(/[^a-z0-9]/g, ""); // Remove invalid characters

  if (validBaseName.length < 4) {
    return NextResponse.json(
      {
        error:
          "Base name must be at least 4 characters after removing invalid characters.",
      },
      { status: 400 }
    );
  }

  const generateUsername = (suffix: string) =>
    `${validBaseName}${suffix}`.slice(0, 20);

  const randomSuffix = () => Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit suffix

  try {
    const suggestions: string[] = [];
    while (suggestions.length < 3) {
      const potentialUsername = generateUsername(randomSuffix().toString());

      const isValid = usernameSchema.safeParse(potentialUsername).success;

      if (isValid) {
        const existingUser = await db.user.findUnique({
          where: { username: potentialUsername },
          select: { id: true },
        });

        if (!existingUser) {
          suggestions.push(potentialUsername);
        }
      }
    }

    return NextResponse.json({ usernames: suggestions });
  } catch (error) {
    console.error("Error generating usernames:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
