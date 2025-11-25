import { differenceInWeeks } from "date-fns";

export const getTotalWeeksInRange = ({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): number => {
  return differenceInWeeks(end, start) + 1;
};
