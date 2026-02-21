import type { ForestState } from "../types/common";

import { STATUS } from "../constants/common";

/**
 * Creates withered tree state when user abandons growing
 * @param state - Current forest state
 * @returns New state with WITHERED status
 */
export function createAbandonTreeState(
  state: ForestState,
  slogan: string,
): ForestState {
  return {
    ...state,
    status: STATUS.WITHERED,
    slogan,
  };
}
