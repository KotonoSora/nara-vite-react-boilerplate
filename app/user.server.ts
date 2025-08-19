import { and, eq, gt } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  getEmailVerificationExpiry,
  getPasswordResetExpiry,
  hashPassword,
  verifyPassword,
} from "~/lib/auth/config";

const { user } = schema;

export type User = typeof user.$inferSelect;
export type CreateUserData = {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "user";
};

export async function createUser(
  db: DrizzleD1Database<typeof schema>,
  userData: CreateUserData,
): Promise<User> {
  const passwordHash = await hashPassword(userData.password);
  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = getEmailVerificationExpiry();

  const [newUser] = await db
    .insert(user)
    .values({
      email: userData.email,
      passwordHash,
      name: userData.name,
      role: userData.role || "user",
      emailVerificationToken,
      emailVerificationExpires,
    })
    .returning();

  // Send email verification with token
  if (import.meta.env.DEV) {
    const verificationLink = `/verify-email?token=${emailVerificationToken}`;
    console.log({ verificationLink });
  }

  return newUser;
}

export async function getUserByEmail(
  db: DrizzleD1Database<typeof schema>,
  email: string,
): Promise<User | null> {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return foundUser || null;
}

export async function getUserById(
  db: DrizzleD1Database<typeof schema>,
  id: number,
): Promise<User | null> {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return foundUser || null;
}

export async function authenticateUser(
  db: DrizzleD1Database<typeof schema>,
  email: string,
  password: string,
): Promise<User | null> {
  const foundUser = await getUserByEmail(db, email);

  if (!foundUser) {
    return null;
  }

  const isValidPassword = await verifyPassword(
    password,
    foundUser.passwordHash,
  );

  if (!isValidPassword) {
    return null;
  }

  return foundUser;
}

export type EmailVerificationResult =
  | { success: true; user: User }
  | {
      success: false;
      error: string;
      errorCode:
        | "INVALID_TOKEN"
        | "EXPIRED_TOKEN"
        | "ALREADY_VERIFIED"
        | "TOKEN_NOT_FOUND"
        | "DATABASE_ERROR";
    };

export async function verifyEmailWithToken(
  db: DrizzleD1Database<typeof schema>,
  token: string,
): Promise<EmailVerificationResult> {
  try {
    // Check if token is provided
    if (!token || token.trim() === "") {
      return {
        success: false,
        error: "Verification token is required",
        errorCode: "INVALID_TOKEN",
      };
    }

    // Find user with the token
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.emailVerificationToken, token))
      .limit(1);

    if (!foundUser) {
      return {
        success: false,
        error: "Invalid verification token",
        errorCode: "TOKEN_NOT_FOUND",
      };
    }

    // Check if email is already verified
    if (foundUser.emailVerified) {
      return {
        success: false,
        error: "Email address has already been verified",
        errorCode: "ALREADY_VERIFIED",
      };
    }

    // Check if token has expired
    if (
      !foundUser.emailVerificationExpires ||
      foundUser.emailVerificationExpires <= new Date()
    ) {
      return {
        success: false,
        error:
          "Verification token has expired. Please request a new verification email",
        errorCode: "EXPIRED_TOKEN",
      };
    }

    // Mark email as verified and clear token
    const [updatedUser] = await db
      .update(user)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, foundUser.id))
      .returning();

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Database error during email verification:", error);
    return {
      success: false,
      error:
        "A database error occurred while verifying your email. Please try again later",
      errorCode: "DATABASE_ERROR",
    };
  }
}

export async function requestPasswordReset(
  db: DrizzleD1Database<typeof schema>,
  email: string,
  baseUrl: string,
): Promise<{ success: boolean; error?: string }> {
  const foundUser = await getUserByEmail(db, email);

  if (!foundUser) {
    // Don't reveal if user exists or not for security
    return { success: true };
  }

  const resetToken = generatePasswordResetToken();
  const resetExpires = getPasswordResetExpiry();

  await db
    .update(user)
    .set({
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
      updatedAt: new Date(),
    })
    .where(eq(user.id, foundUser.id));

  // Send email confirm reset password with token
  if (import.meta.env.DEV) {
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    console.log({ resetLink });
  }

  return { success: true };
}

export async function resetPasswordWithToken(
  db: DrizzleD1Database<typeof schema>,
  token: string,
  newPassword: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(
      and(
        eq(user.passwordResetToken, token),
        gt(user.passwordResetExpires!, new Date()),
      ),
    )
    .limit(1);

  if (!foundUser) {
    return { success: false, error: "Invalid or expired reset token" };
  }

  const passwordHash = await hashPassword(newPassword);

  const [updatedUser] = await db
    .update(user)
    .set({
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, foundUser.id))
    .returning();

  return { success: true, user: updatedUser };
}
