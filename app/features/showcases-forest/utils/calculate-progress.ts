export function calculateProgress(
  initialSeconds: number,
  currentSeconds: number,
): number {
  if (initialSeconds === 0) return 0;
  return Math.max(
    0,
    Math.min(100, ((initialSeconds - currentSeconds) / initialSeconds) * 100),
  );
}
