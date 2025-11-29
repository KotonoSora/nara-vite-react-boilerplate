import { differenceInWeeks } from "date-fns";

import type { GetIndexCurrentMonthProps } from "../types/util";

import { getStartDateOfWeek } from "./get-start-date-of-week";

export const getIndexCurrentMonth = ({
  start,
  date,
  weekStartsOn,
}: GetIndexCurrentMonthProps): number => {
  const end = getStartDateOfWeek({ date, weekStartsOn });

  return differenceInWeeks(end, start);
};
