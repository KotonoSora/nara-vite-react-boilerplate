import { startOfYear } from "date-fns";

import type { Day } from "date-fns";

import { getStartDateOfWeek } from "./get-start-date-of-week";

export const getStartDateFirstWeekOfYear = ({
  date,
  weekStartsOn,
}: {
  date: Date;
  weekStartsOn: Day;
}) => {
  return getStartDateOfWeek({
    date: startOfYear(date),
    weekStartsOn,
  });
};
