import type { ForestState } from "../types/common";

export function updateTimerPreviewState(
  prev: ForestState,
  minutes: number,
): ForestState {
  return {
    ...prev,
    seconds: minutes * 60,
    initialSeconds: minutes * 60,
  };
}
