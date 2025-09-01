import { useMemo } from "react";

import type { WeekRowProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { dayToIndex, indexToWeek } from "../utils/helper-date";
import { DayCell } from "./day-cell";

export function WeekRow({ weekIndex }: WeekRowProps) {
  const { rowHeight, todayDayIndex, mode } = useCalendar();

  if (mode === "sequence") {
    return (
      <div
        style={{ height: rowHeight }}
        className="grid grid-cols-7 gap-2 pb-2"
      >
        {Array.from({ length: 7 }, (_, j) => {
          const dayIndex = weekIndex * 7 + j;
          return <DayCell key={dayIndex} dayGlobalIndex={dayIndex} />;
        })}
      </div>
    );
  }

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
    <div style={{ height: rowHeight }} className="grid grid-cols-7 gap-2 pb-2">
      {days.map((d) => {
        const globalDayIdx = dayToIndex(d);
        const isToday = globalDayIdx === todayDayIndex;
        return <DayCell key={d.toISOString()} day={d} isToday={isToday} />;
      })}
    </div>
  );
}
