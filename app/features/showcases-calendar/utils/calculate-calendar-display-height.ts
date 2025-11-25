import { endOfMonth, startOfMonth } from "date-fns";

import type { CalculateCalendarDisplayHeightProps } from "../types/util";

import { getStartDateOfWeek } from "./get-start-date-of-week";
import { getTotalWeeksInRange } from "./get-total-weeks-in-range";

export const calculateCalendarDisplayHeight = ({
  date,
  weekStartsOn,
  itemHeight = 80,
}: CalculateCalendarDisplayHeightProps): number => {
  const start = getStartDateOfWeek({
    date: startOfMonth(date),
    weekStartsOn,
  });

  const end = getStartDateOfWeek({
    date: endOfMonth(date),
    weekStartsOn,
  });

  const weeksInMonth = getTotalWeeksInRange({
    start,
    end,
  });

  return weeksInMonth * itemHeight;
};
