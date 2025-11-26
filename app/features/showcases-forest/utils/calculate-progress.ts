/**
 * Calculates progress percentage based on elapsed time
 * @param initialSeconds - Total duration in seconds
 * @param currentSeconds - Remaining seconds
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(
  initialSeconds: number,
  currentSeconds: number,
): number {
  if (initialSeconds <= 0) return 0;
  const progress = ((initialSeconds - currentSeconds) / initialSeconds) * 100;
  return Math.max(0, Math.min(100, progress));
}
