import type { ForestState } from "../types/common";

import { RANGE_MIN, STATUS } from "../constants/common";
import { getRandomSlogan } from "./get-random-slogan";

/**
 * Creates initial planting state with default timer
 * @returns New state with PLANTING status
 */
export function createPlantingState(): ForestState {
  const seconds = RANGE_MIN * 60;
  return {
    status: STATUS.PLANTING,
    seconds,
    initialSeconds: seconds,
    slogan: getRandomSlogan(),
  };
}
