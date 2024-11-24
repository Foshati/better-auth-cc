import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/auth-schema";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedFields = forgotPasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = validatedFields.data;

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Find user and update their reset token
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Still return success to prevent user enumeration
      return NextResponse.json({ message: "Reset email sent successfully" });
    }

    // Store the reset token in the database
    await prisma.verification.create({
      data: {
        id: crypto.randomBytes(16).toString("hex"),
        identifier: user.id,
        value: resetToken,
        expiresAt: resetTokenExpiry,
      },
    });

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: "Reset your password",
      text: `Click this link to reset your password: ${resetUrl}`,
      html: `<p>Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    if (!emailResult.success) {
      throw new Error("Failed to send email");
    }

    return NextResponse.json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
