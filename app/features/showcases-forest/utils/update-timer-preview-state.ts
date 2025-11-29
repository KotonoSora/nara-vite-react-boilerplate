import type { ForestState } from "../types/common";

/**
 * Updates timer preview when user adjusts duration
 * @param prev - Previous forest state
 * @param minutes - New duration in minutes
 * @returns Updated state with new timer values
 */
export function updateTimerPreviewState({
  minutes,
}: {
  minutes: number;
}): Pick<ForestState, "seconds" | "initialSeconds"> {
  const seconds = minutes * 60;
  return {
    seconds,
    initialSeconds: seconds,
  };
}
