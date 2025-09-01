import { useMemo } from "react";

import type { WeekRowProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { indexToWeek } from "../utils/helper-date";
import { DayCell } from "./day-cell";

export function WeekRow({ weekIndex }: WeekRowProps) {
  const { rowHeight, mode } = useCalendar();

  const rowStyle = useMemo(() => ({ height: rowHeight }), [rowHeight]);

  if (mode === "sequence") {
    const sequenceCells = useMemo(() => {
      return Array.from({ length: 7 }, (_, j) => {
        const dayIndex = weekIndex * 7 + j;
        return <DayCell key={dayIndex} dayGlobalIndex={dayIndex} />;
      });
    }, [weekIndex]);

    return (
      <div style={rowStyle} className="grid grid-cols-7 gap-2 pb-2">
        {sequenceCells}
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

  const dateCells = useMemo(
    () => days.map((d) => <DayCell key={d.toISOString()} day={d} />),
    [days],
  );

  return (
    <div style={rowStyle} className="grid grid-cols-7 gap-2 pb-2">
      {dateCells}
    </div>
  );
}
