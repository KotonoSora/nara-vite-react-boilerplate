/**
 * Calculates and returns the session expiry date, which is set to 30 days from the current date and time.
 *
 * @returns {Date} The `Date` object representing the session's expiry time, 30 days from now.
 */
export function getSessionExpiry(): Date {
  const now = new Date();
  // Session expires in 30 days
  now.setDate(now.getDate() + 30);
  return now;
}
