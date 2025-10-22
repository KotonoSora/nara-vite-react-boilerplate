/**
 * Returns the user's current IANA time zone string as determined by the browser.
 *
 * @returns {string} The IANA time zone identifier (e.g., "America/New_York").
 *
 * @example
 * ```typescript
 * const timezone = getUserTimezone();
 * // timezone might be "Europe/London"
 * ```
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
