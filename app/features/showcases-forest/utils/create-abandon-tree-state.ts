import type { ForestState } from "../types/common";

import { STATUS } from "../constants/common";

export function createAbandonTreeState(state: ForestState): ForestState {
  return {
    status: STATUS.WITHERED,
    seconds: 0,
    initialSeconds: state.initialSeconds,
    slogan: state.slogan,
  };
}
