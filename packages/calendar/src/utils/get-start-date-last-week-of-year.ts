import { endOfYear } from "date-fns";

import type { GetStartDateProps, GetStartDateReturn } from "../types/util";

import { getStartDateOfWeek } from "./get-start-date-of-week";

export const getStartDateLastWeekOfYear = ({
  date,
  weekStartsOn,
}: GetStartDateProps): GetStartDateReturn => {
  return getStartDateOfWeek({
    date: endOfYear(date),
    weekStartsOn,
  });
};
