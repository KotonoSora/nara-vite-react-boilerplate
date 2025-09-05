import { createContext, useContext } from "react";

import type { CalendarContextValue } from "../types/type";

/**
 * Context for the calendar.
 */
export const CalendarContext = createContext<CalendarContextValue | undefined>(
  undefined,
);

/**
 * Hook to access the calendar context.
 *
 * @returns The calendar context value.
 */
export function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}
