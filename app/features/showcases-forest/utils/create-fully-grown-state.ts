import type { ForestState } from "../types/common";

import { STATUS } from "../constants/common";

/**
 * Creates fully grown tree state when timer completes
 * @param prevState - Previous state to preserve slogan and initial seconds
 * @returns New state with FULLY_GROWN status
 */
export function createFullyGrownState(prevState: ForestState): ForestState {
  return {
    status: STATUS.FULLY_GROWN,
    seconds: 0,
    initialSeconds: prevState.initialSeconds,
    slogan: prevState.slogan,
  };
}
