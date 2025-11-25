import { endOfMonth, startOfMonth } from "date-fns";

import type { Day } from "date-fns";

import { getStartDateOfWeek } from "./get-start-date-of-week";
import { getTotalWeeksInRange } from "./get-total-weeks-in-range";

export const calculateCalendarDisplayHeight = ({
  date,
  weekStartsOn,
  itemHeight = 80,
}: {
  date: Date;
  weekStartsOn: Day;
  itemHeight?: number;
}): number => {
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
