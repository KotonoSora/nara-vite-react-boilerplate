import { hashPassword } from "./hash-password";

/**
 * Verifies whether a plain text password matches a given hashed password.
 *
 * This function hashes the provided plain text password and compares it to the stored hashed password.
 *
 * @param password - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to `true` if the password matches the hash, otherwise `false`.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hashedPassword;
}
