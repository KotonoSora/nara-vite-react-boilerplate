import { startOfYear } from "date-fns";

import type { GetStartDateProps, GetStartDateReturn } from "../types/util";

import { getStartDateOfWeek } from "./get-start-date-of-week";

export const getStartDateFirstWeekOfYear = ({
  date,
  weekStartsOn,
}: GetStartDateProps): GetStartDateReturn => {
  return getStartDateOfWeek({
    date: startOfYear(date),
    weekStartsOn,
  });
};
