import { startOfWeek } from "date-fns";

import type { Day } from "date-fns";

export const getStartDateOfWeek = ({
  date,
  weekStartsOn,
}: {
  date: Date;
  weekStartsOn: Day;
}): Date => {
  return startOfWeek(date, {
    weekStartsOn,
  });
};
