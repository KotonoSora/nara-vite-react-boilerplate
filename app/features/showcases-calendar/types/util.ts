import type { Day } from "date-fns";

export type CalculateCalendarDisplayHeightProps = {
  date: Date;
  weekStartsOn: Day;
  itemHeight?: number;
};

export type GetIndexCurrentMonthProps = {
  start: Date;
  date: Date;
  weekStartsOn: Day;
};

export type GetStartDateProps = {
  date: Date;
  weekStartsOn: Day;
};

export type GetStartDateReturn = Date;

export type GetTotalWeeksInRangeProps = {
  start: Date;
  end: Date;
};
