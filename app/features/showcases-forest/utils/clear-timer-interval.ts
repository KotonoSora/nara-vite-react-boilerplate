import type { RefObject } from "react";

export function clearTimerInterval(
  intervalRef: RefObject<number | null>,
): void {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
}
