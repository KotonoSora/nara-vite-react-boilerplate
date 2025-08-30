import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  CalendarContextValue,
  CalendarEvent,
  CalendarProviderProps,
  DayCellProps,
  EventsMap,
  InfiniteScrollProps,
  WeekRowProps,
} from "../types/type";

export const CalendarContext = createContext<CalendarContextValue | null>(null);

export function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}
