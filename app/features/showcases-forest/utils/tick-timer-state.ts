import type { ForestState } from "../types/common";

import { STATUS } from "../constants/common";

export function tickTimerState(prev: ForestState): ForestState {
  if (prev.seconds <= 1) {
    return {
      ...prev,
      status: STATUS.FULLY_GROWN,
      seconds: 0,
    };
  }
  return {
    ...prev,
    seconds: prev.seconds - 1,
  };
}
