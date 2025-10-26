/**
 * Generates a new unique session ID using the browser's `crypto.randomUUID()` method.
 *
 * @returns {string} A newly generated UUID string to be used as a session identifier.
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}
