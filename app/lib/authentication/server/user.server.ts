import { and, eq, gt } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import type {
  CreateUserDataSchema,
  EmailVerificationResultSchema,
  UserSchema,
} from "../types/user";

import * as schema from "~/database/schema";
import { generateEmailVerificationToken } from "~/lib/authentication/utils/common/generate-email-verification-token";
import { generatePasswordResetToken } from "~/lib/authentication/utils/common/generate-password-reset-token";
import { getEmailVerificationExpiry } from "~/lib/authentication/utils/common/get-email-verification-expiry";
import { getPasswordResetExpiry } from "~/lib/authentication/utils/common/get-password-reset-expiry";
import { hashPassword } from "~/lib/authentication/utils/common/hash-password";
import { verifyPassword } from "~/lib/authentication/utils/common/verify-password";

const { user } = schema;

/**
 * Creates a new user in the database with the provided user data.
 * Hashes the user's password, generates an email verification token,
 * and sets the verification expiry. Optionally logs the verification
 * link in development mode.
 *
 * @param db - The DrizzleD1Database instance connected to the schema.
 * @param userData - The data required to create a new user, including email, password, name, and optional role.
 * @returns A promise that resolves to the newly created user object.
 */
export async function createUser(
  db: DrizzleD1Database<typeof schema>,
  userData: CreateUserDataSchema,
): Promise<UserSchema> {
  const passwordHash = await hashPassword(userData.password);
  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = getEmailVerificationExpiry();

  const [newUser] = await db
    .insert(user)
    .values({
      id: crypto.randomUUID(),
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

/**
 * Gets a user by email address.
 *
 * @param db - The database instance
 * @param email - The email address of the user
 * @returns The user object if found, or null if not found
 */
export async function getUserByEmail(
  db: DrizzleD1Database<typeof schema>,
  email: string,
): Promise<UserSchema | null> {
  const foundUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .get();

  return foundUser || null;
}

/**
 * Retrieves a user from the database by their unique ID.
 *
 * @param db - The DrizzleD1Database instance connected to the database.
 * @param id - The unique identifier of the user to retrieve.
 * @returns A promise that resolves to the user object if found, or `null` if no user exists with the given ID.
 */
export async function getUserById(
  db: DrizzleD1Database<typeof schema>,
  id: string,
): Promise<UserSchema | null> {
  const foundUser = await db.select().from(user).where(eq(user.id, id)).get();

  return foundUser || null;
}

/**
 * Authenticates a user by verifying their email and password.
 *
 * @param db - The DrizzleD1Database instance connected to the user schema.
 * @param email - The email address of the user attempting to authenticate.
 * @param password - The plaintext password provided by the user.
 * @returns A promise that resolves to the authenticated user's schema object if authentication is successful, or `null` if authentication fails.
 */
export async function authenticateUser(
  db: DrizzleD1Database<typeof schema>,
  email: string,
  password: string,
): Promise<UserSchema | null> {
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

/**
 * Verifies a user's email address using a provided verification token.
 *
 * This function checks the validity of the token, ensures the email is not already verified,
 * and that the token has not expired. If all checks pass, it marks the user's email as verified,
 * clears the verification token and its expiration, and updates the user's record.
 *
 * @param db - The DrizzleD1Database instance connected to the user schema.
 * @param token - The email verification token to validate.
 * @returns A promise that resolves to an `EmailVerificationResult` indicating the outcome:
 *   - `success: true` and the updated user if verification succeeds.
 *   - `success: false` and an error message with an error code if verification fails.
 *
 * @error INVALID_TOKEN - If the token is missing or empty.
 * @error TOKEN_NOT_FOUND - If no user is found with the provided token.
 * @error ALREADY_VERIFIED - If the user's email is already verified.
 * @error EXPIRED_TOKEN - If the verification token has expired.
 * @error DATABASE_ERROR - If a database error occurs during the process.
 */
export async function verifyEmailWithToken(
  db: DrizzleD1Database<typeof schema>,
  token: string,
): Promise<EmailVerificationResultSchema> {
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
    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.emailVerificationToken, token))
      .get();

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

/**
 * Sends a password reset email with a token to the user if the email exists.
 *
 * @param db - The database instance
 * @param email - The email address of the user
 * @param baseUrl - The base URL of the application
 * @returns A promise that resolves to an object indicating the success or failure of the operation
 */
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
    .where(eq(user.id, foundUser.id))
    .run();

  // Send email confirm reset password with token
  if (import.meta.env.DEV) {
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    console.log({ resetLink });
  }

  return { success: true };
}

/**
 * Resets the user's password using a password reset token.
 *
 * @param db - The database instance
 * @param token - The password reset token
 * @param newPassword - The new password to set
 * @returns An object indicating the success or failure of the operation
 */
export async function resetPasswordWithToken(
  db: DrizzleD1Database<typeof schema>,
  token: string,
  newPassword: string,
): Promise<{ success: boolean; user?: UserSchema; error?: string }> {
  const foundUser = await db
    .select()
    .from(user)
    .where(
      and(
        eq(user.passwordResetToken, token),
        gt(user.passwordResetExpires!, new Date()),
      ),
    )
    .get();

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
