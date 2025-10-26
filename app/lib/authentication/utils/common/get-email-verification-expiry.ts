/**
 * Returns a `Date` object representing the expiry time for an email verification token.
 *
 * The expiry time is set to 24 hours from the current time.
 *
 * @returns {Date} The date and time when the email verification token will expire.
 */
export function getEmailVerificationExpiry(): Date {
  const now = new Date();
  // Token expires in 24 hours
  now.setHours(now.getHours() + 24);
  return now;
}
