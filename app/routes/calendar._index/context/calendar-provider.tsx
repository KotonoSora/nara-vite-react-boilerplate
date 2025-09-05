import { useEffect, useMemo, useRef, useState } from "react";

import type { CalendarProviderProps } from "../types/type";

import { CalendarContext } from "../context/calendar-context";
import { dayToIndex } from "../utils/helper-date";
import { usePageContext } from "./page-context";

/**
 * Calendar provider component.
 *
 * @param params - The parameters for the calendar provider.
 * @returns The calendar provider component.
 */
export function CalendarProvider({ children }: CalendarProviderProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { weeksPerScreen, mode } = usePageContext();
  const [rowHeight, setRowHeight] = useState<number>(0);

  const today = useMemo(() => new Date(), []);
  const todayDayIndex = useMemo(() => dayToIndex(today), [today]);
  const overScan = Math.max(1, weeksPerScreen + 1);

  const calendarContextValue = useMemo(
    () => ({
      rowHeight,
      weeksPerScreen,
      overScan,
      today,
      todayDayIndex,
      mode,
    }),
    [rowHeight, weeksPerScreen, overScan, today, todayDayIndex, mode],
  );

  useEffect(() => {
    if (!parentRef?.current) return;

    const measure = () => {
      const h = parentRef.current ? parentRef.current.clientHeight : 0;

      if (h > 0) {
        const computed = Math.floor(h / weeksPerScreen);

        setRowHeight((prev) => (prev !== computed ? computed : prev));
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(parentRef.current);
    return () => ro.disconnect();
  }, [parentRef, weeksPerScreen]);

  return (
    <div ref={parentRef} className="relative flex flex-col flex-1 min-h-0">
      <CalendarContext.Provider value={calendarContextValue}>
        {rowHeight > 0 ? children : null}
      </CalendarContext.Provider>
    </div>
  );
}
