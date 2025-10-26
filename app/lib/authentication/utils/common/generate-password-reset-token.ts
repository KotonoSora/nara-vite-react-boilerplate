/**
 * Generates a password reset token.
 *
 * @returns A unique password reset token.
 */
export function generatePasswordResetToken(): string {
  return crypto.randomUUID() + "-" + Date.now().toString(36);
}
