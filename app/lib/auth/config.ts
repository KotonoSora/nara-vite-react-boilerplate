import { z } from "zod";

/**
 * Hashes a password using a secure hashing algorithm.
 *
 * @param password - The password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hashedPassword;
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function getSessionExpiry(): Date {
  const now = new Date();
  // Session expires in 30 days
  now.setDate(now.getDate() + 30);
  return now;
}

export function generateEmailVerificationToken(): string {
  return crypto.randomUUID() + "-" + Date.now().toString(36);
}

export function getEmailVerificationExpiry(): Date {
  const now = new Date();
  // Token expires in 24 hours
  now.setHours(now.getHours() + 24);
  return now;
}

// Define individual validation schemas for each requirement
const minLengthSchema = z.string().min(8);
const uppercaseSchema = z.string().regex(/[A-Z]/);
const lowercaseSchema = z.string().regex(/[a-z]/);
const numberSchema = z.string().regex(/\d/);
const specialCharSchema = z.string().regex(/[!@#$%^&*(),.?":{}|<>]/);

/**
 * Checks if a password is strong based on defined criteria.
 *
 * @param password - The password to check.
 * @returns An object containing the validation result and requirements.
 */
export function isStrongPassword(password: string): {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
} {
  const requirements = {
    minLength: minLengthSchema.safeParse(password).success,
    hasUppercase: uppercaseSchema.safeParse(password).success,
    hasLowercase: lowercaseSchema.safeParse(password).success,
    hasNumber: numberSchema.safeParse(password).success,
    hasSpecialChar: specialCharSchema.safeParse(password).success,
  };

  const isValid = Object.values(requirements).every(Boolean);

  return { isValid, requirements };
}

/**
 * Generates a password reset token.
 *
 * @returns A unique password reset token.
 */
export function generatePasswordResetToken(): string {
  return crypto.randomUUID() + "-" + Date.now().toString(36);
}

/**
 * Gets the expiration date for the password reset token.
 *
 * @returns The expiration date for the password reset token.
 */
export function getPasswordResetExpiry(): Date {
  const now = new Date();
  // Token expires in 1 hour
  now.setHours(now.getHours() + 1);
  return now;
}
