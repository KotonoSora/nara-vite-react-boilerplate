import type { ReactNode } from "react";

export type CalendarEvent = { id: string; label: string };
export type EventsMap = Record<string, CalendarEvent[]>;

export type CalendarContextValue = {
  rowHeight: number;
  weeksPerScreen: number;
  overScan: number;
  timezone?: string;
  renderDay?: (day: Date, isToday: boolean) => ReactNode;
  today: Date;
  todayDayIndex: number; // day index (days since epoch)
};

export type CalendarProviderProps = {
  children: ReactNode;
  rowHeight?: number | undefined; // if provided, use it; otherwise compute from parentRef
  weeksPerScreen: number;
  overScan: number;
  timezone?: string;
  parentRef: React.RefObject<HTMLDivElement | null>;
  renderDay?: (day: Date, isToday: boolean) => ReactNode;
};

export type InfiniteScrollProps = {
  children: (weekIndex: number) => ReactNode;
};

export type WeekRowProps = { weekIndex: number };

export type DayCellProps = { day: Date; isToday: boolean };

export type WrapperWeekRowProps = {
  weekIndex: number;
  offset: number;
  rowHeight: number;
  children: ReactNode;
};
