/**
 * Formats seconds to MM:SS format
 * @param seconds - Total seconds
 * @returns Formatted time string (e.g., "25:00")
 */
export function formatSecondsToMinutesSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}
