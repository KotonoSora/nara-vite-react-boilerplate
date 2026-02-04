import type { RefObject } from "react";

/**
 * Clears interval and resets ref to null
 * @param intervalRef - Mutable ref containing interval ID
 */
export function clearTimerInterval(
  intervalRef: RefObject<number | null>,
): void {
  if (intervalRef.current !== null) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
}
