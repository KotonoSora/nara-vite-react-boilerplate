import type { WeekRowProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { indexToWeek } from "../utils/helper-date";
import { DayCell } from "./day-cell";

export function WeekRow({ weekIndex, renderDay }: WeekRowProps) {
  const { rowHeight, mode } = useCalendar();

  const rowStyle = { height: rowHeight };

  if (mode === "sequence") {
    const sequenceCells = Array.from({ length: 7 }, (_, j) => {
      const dayIndex = weekIndex * 7 + j;
      return (
        <DayCell
          key={dayIndex}
          dayGlobalIndex={dayIndex}
          renderDay={renderDay}
        />
      );
    });

    return (
      <div style={rowStyle} className="grid grid-cols-7 gap-2 pb-2">
        {sequenceCells}
      </div>
    );
  }

  const weekStart = indexToWeek(weekIndex);

  const days = Array.from({ length: 7 }, (_, j) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + j);
    return d;
  });

  const dateCells = days.map((d) => (
    <DayCell key={d.toISOString()} day={d} renderDay={renderDay} />
  ));

  return (
    <div style={rowStyle} className="grid grid-cols-7 gap-2 pb-2">
      {dateCells}
    </div>
  );
}
