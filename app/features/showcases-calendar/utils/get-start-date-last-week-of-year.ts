import { endOfYear } from "date-fns";

import type { Day } from "date-fns";

import { getStartDateOfWeek } from "./get-start-date-of-week";

export const getStartDateLastWeekOfYear = ({
  date,
  weekStartsOn,
}: {
  date: Date;
  weekStartsOn: Day;
}) => {
  return getStartDateOfWeek({
    date: endOfYear(date),
    weekStartsOn,
  });
};
