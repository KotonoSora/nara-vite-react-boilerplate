import {
  DAY_EPOCH,
  MS_PER_DAY,
  MS_PER_WEEK,
  WEEK_EPOCH,
} from "../constants/common";

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function getWeekStart(date: Date, weekStartsOn = 1): Date {
  const d = new Date(date);
  const day = (d.getDay() + 7 - weekStartsOn) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function indexToWeek(index: number, epoch = WEEK_EPOCH): Date {
  const d = new Date(epoch);
  d.setDate(d.getDate() + index * 7);
  return getWeekStart(d);
}

export function weekToIndex(date: Date, epoch = WEEK_EPOCH): number {
  const start = getWeekStart(date);
  return Math.floor((+start - +epoch) / MS_PER_WEEK);
}

export function dayToIndex(date: Date, epoch = DAY_EPOCH): number {
  const sd = startOfDay(date);
  return Math.floor((+sd - +epoch) / MS_PER_DAY);
}
