import { differenceInWeeks } from "date-fns";

import type { GetTotalWeeksInRangeProps } from "../types/util";

export const getTotalWeeksInRange = ({
  start,
  end,
}: GetTotalWeeksInRangeProps): number => {
  return differenceInWeeks(end, start) + 1;
};
