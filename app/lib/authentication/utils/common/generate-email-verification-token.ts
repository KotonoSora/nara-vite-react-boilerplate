/**
 * Generates a unique email verification token.
 *
 * The token is composed of a UUID (generated using `crypto.randomUUID()`)
 * concatenated with the current timestamp in base-36 format, separated by a hyphen.
 * This ensures a high degree of uniqueness and can be used for secure email verification workflows.
 *
 * @returns {string} A unique email verification token.
 */
export function generateEmailVerificationToken(): string {
  return crypto.randomUUID() + "-" + Date.now().toString(36);
}
