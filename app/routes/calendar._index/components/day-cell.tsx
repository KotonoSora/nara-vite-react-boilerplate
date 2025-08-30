import { useCallback } from "react";

import type { DragEvent } from "react";
import type { DayCellProps } from "../types/type";

import { cn } from "~/lib/utils";

import { useCalendar } from "../context/calendar-context";

export function DayCell({ day, isToday }: DayCellProps) {
  const { renderDay } = useCalendar();

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      const data = e.dataTransfer.getData("text/plain");
      alert(`Dropped ${data} vào ngày ${day.toDateString()}`);
    },
    [day],
  );

  const defaultRender = useCallback((d: Date) => {
    if (d.getDate() === 1) {
      const needsYear = d.getFullYear() !== new Date().getFullYear();
      const fmt = new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "2-digit",
        ...(needsYear ? { year: "numeric" } : {}),
      } as Intl.DateTimeFormatOptions);
      return <div className="text-sm">{fmt.format(d)}</div>;
    }
    return <div className="text-sm">{d.getDate()}</div>;
  }, []);

  return (
    <div
      className={cn(
        "border-r border-gray-100 p-2 box-border",
        isToday ? "ring-1 ring-inset ring-indigo-200" : "",
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-date={day.toDateString()}
    >
      {renderDay ? renderDay(day, isToday) : defaultRender(day)}
    </div>
  );
}
