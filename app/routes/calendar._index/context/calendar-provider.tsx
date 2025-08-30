import { useEffect, useMemo, useState } from "react";

import type { CalendarProviderProps } from "../types/type";

import { CalendarContext } from "../context/calendar-context";
import { dayToIndex } from "../utils/helper-date";

export function CalendarProvider({
  children,
  rowHeight: rowHeightProp,
  weeksPerScreen,
  overScan,
  timezone,
  renderDay,
  parentRef,
}: CalendarProviderProps) {
  const [rowHeight, setRowHeight] = useState<number>(0);

  // Measure parentRef height on client and update rowHeight.
  // Use useEffect (not useLayoutEffect) so we don't block SSR; provider will render children only after measurement.
  useEffect(() => {
    if (!parentRef?.current) return;

    const measure = () => {
      const h = parentRef.current ? parentRef.current.clientHeight : 0;

      if (h > 0) {
        const computed =
          weeksPerScreen &&
          rowHeightProp &&
          rowHeightProp > 0 &&
          weeksPerScreen !== 0
            ? rowHeightProp
            : Math.floor(h / weeksPerScreen);

        setRowHeight((prev) => (prev !== computed ? computed : prev));
      }
    };

    measure();

    // observe changes
    const ro = new ResizeObserver(measure);
    ro.observe(parentRef.current);
    return () => ro.disconnect();
  }, [parentRef, weeksPerScreen, rowHeightProp]);

  // If explicit prop provided, ensure it's used (in case it's set after mount)
  useEffect(() => {
    if (typeof rowHeightProp === "number" && rowHeightProp > 0) {
      setRowHeight(rowHeightProp);
    }
  }, [rowHeightProp]);

  const today = useMemo(() => new Date(), []);
  const todayDayIndex = useMemo(() => dayToIndex(today), [today]);

  const value = useMemo(
    () => ({
      rowHeight,
      weeksPerScreen,
      overScan,
      timezone,
      renderDay,
      today,
      todayDayIndex,
    }),
    [
      rowHeight,
      weeksPerScreen,
      overScan,
      timezone,
      renderDay,
      today,
      todayDayIndex,
    ],
  );

  // Render children only when rowHeight is known to avoid layout jump / hydration mismatch
  return (
    <CalendarContext.Provider value={value}>
      {rowHeight > 0 ? children : null}
    </CalendarContext.Provider>
  );
}
