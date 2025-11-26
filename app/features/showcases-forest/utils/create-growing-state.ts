import type { ForestState } from "../types/common";

import { STATUS } from "../constants/common";
import { getRandomSlogan } from "./get-random-slogan";

export function createGrowingState(minutes: number): ForestState {
  const targetSeconds = minutes * 60;
  return {
    status: STATUS.GROWING,
    seconds: targetSeconds,
    initialSeconds: targetSeconds,
    slogan: getRandomSlogan(),
  };
}
