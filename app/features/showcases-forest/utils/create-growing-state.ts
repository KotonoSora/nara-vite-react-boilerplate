import type { ForestState } from "../types/common";

import { STATUS } from "../constants/common";
import { getRandomSlogan } from "./get-random-slogan";

/**
 * Creates growing tree state with countdown timer
 * @param minutes - Duration in minutes
 * @returns New state with GROWING status
 */
export function createGrowingState(minutes: number): ForestState {
  const seconds = minutes * 60;
  return {
    status: STATUS.GROWING,
    seconds,
    initialSeconds: seconds,
    slogan: getRandomSlogan(),
  };
}
