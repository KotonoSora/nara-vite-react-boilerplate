import { startOfWeek } from "date-fns";

import type { GetStartDateProps, GetStartDateReturn } from "../types/util";

export const getStartDateOfWeek = ({
  date,
  weekStartsOn,
}: GetStartDateProps): GetStartDateReturn => {
  return startOfWeek(date, {
    weekStartsOn,
  });
};
