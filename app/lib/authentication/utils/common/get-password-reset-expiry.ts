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
