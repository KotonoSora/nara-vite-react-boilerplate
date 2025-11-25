import { differenceInWeeks } from "date-fns";

import type { Day } from "date-fns";

import { getStartDateOfWeek } from "./get-start-date-of-week";

export const getIndexCurrentMonth = ({
  start,
  date,
  weekStartsOn,
}: {
  start: Date;
  date: Date;
  weekStartsOn: Day;
}) => {
  const end = getStartDateOfWeek({ date, weekStartsOn });

  return differenceInWeeks(end, start);
};
