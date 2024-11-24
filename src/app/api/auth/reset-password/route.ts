import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/auth-schema";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedFields = resetPasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid password format" },
        { status: 400 }
      );
    }

    const { token, password } = validatedFields.data;

    // Find valid reset token
    const verification = await prisma.verification.findFirst({
      where: {
        value: token,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.account.update({
      where: {
        userId: verification.identifier,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Delete the used verification token
    await prisma.verification.delete({
      where: {
        id: verification.id,
      },
    });

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
