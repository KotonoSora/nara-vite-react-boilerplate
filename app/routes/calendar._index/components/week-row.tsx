import { useMemo } from "react";

import type { WeekRowProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { dayToIndex, indexToWeek } from "../utils/helper-date";
import { DayCell } from "./day-cell";

export function WeekRow({ weekIndex }: WeekRowProps) {
  const { rowHeight, todayDayIndex } = useCalendar();

  const weekStart = indexToWeek(weekIndex);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, j) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + j);
        return d;
      }),
    [weekStart],
  );

  return (
    <div
      style={{ height: rowHeight }}
      className="grid grid-cols-7 border-b border-gray-300"
    >
      {days.map((d) => {
        const globalDayIdx = dayToIndex(d);
        const isToday = globalDayIdx === todayDayIndex;
        return <DayCell key={d.toISOString()} day={d} isToday={isToday} />;
      })}
    </div>
  );
}
