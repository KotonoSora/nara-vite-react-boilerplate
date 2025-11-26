import type { ForestState } from "../types/common";

import { RANGE_MIN, STATUS } from "../constants/common";
import { getRandomSlogan } from "./get-random-slogan";

export function createPlantingState(): ForestState {
  return {
    status: STATUS.PLANTING,
    seconds: RANGE_MIN * 60,
    initialSeconds: RANGE_MIN * 60,
    slogan: getRandomSlogan(),
  };
}
