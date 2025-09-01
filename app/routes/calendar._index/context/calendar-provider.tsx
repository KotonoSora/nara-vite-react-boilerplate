import { useEffect, useMemo, useState } from "react";

import type { CalendarProviderProps } from "../types/type";

import { CalendarContext } from "../context/calendar-context";
import { dayToIndex } from "../utils/helper-date";

/**
 * Calendar provider component.
 *
 * @param params - The parameters for the calendar provider.
 * @returns The calendar provider component.
 */
export function CalendarProvider({
  children,
  rowHeight: rowHeightProp,
  weeksPerScreen,
  overScan,
  timezone,
  renderDay,
  parentRef,
  mode,
}: CalendarProviderProps) {
  const [rowHeight, setRowHeight] = useState<number>(0);

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

    const ro = new ResizeObserver(measure);
    ro.observe(parentRef.current);
    return () => ro.disconnect();
  }, [parentRef, weeksPerScreen, rowHeightProp]);

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
      mode,
    }),
    [
      rowHeight,
      weeksPerScreen,
      overScan,
      timezone,
      renderDay,
      today,
      todayDayIndex,
      mode,
    ],
  );

  return (
    <CalendarContext.Provider value={value}>
      {rowHeight > 0 ? children : null}
    </CalendarContext.Provider>
  );
}
