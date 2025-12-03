"use server";

import { db } from "@/lib/db";
import { Resend } from "resend";
import { renderToString } from "react-dom/server";
import PasswordResetEmail from "@/lib/email-templates/password-reset";
import crypto from "crypto";
import { clerkClient } from "@clerk/nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestPasswordReset(email: string) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email format" };
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "OrbitHR <noreply@resend.dev>",
      to: email,
      subject: "Password Reset Request - OrbitHR",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.firstName},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    return {
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "Failed to process password reset request" };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    // Validate password strength
    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }

    // Find user with valid token
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return { success: false, error: "Invalid or expired reset token" };
    }

    // Update password in Clerk
    const client = await clerkClient();
    await client.users.updateUser(user.clerkId, {
      password: newPassword,
    });

    // Clear reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
