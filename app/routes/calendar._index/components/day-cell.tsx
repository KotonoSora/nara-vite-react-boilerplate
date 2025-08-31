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

  const defaultRender = useCallback((d: Date, isToday: boolean) => {
    const isFirstDay = d.getDate() === 1;

    const needsYear = d.getFullYear() !== new Date().getFullYear();
    const fmt = new Intl.DateTimeFormat(undefined, {
      day: "2-digit",
      ...(isFirstDay ? { month: "2-digit" } : {}),
      ...(isFirstDay && needsYear ? { year: "numeric" } : {}),
    } as Intl.DateTimeFormatOptions);

    const dateString = fmt.format(d);

    return (
      <div
        className={cn("text-sm", {
          "w-[24px] h-[24px] rounded-xl text-center flex flex-col items-center justify-center font-bold bg-primary text-primary-foreground":
            isToday,
          "font-bold underline": isFirstDay,
        })}
      >
        {dateString}
      </div>
    );
  }, []);

  return (
    <div
      className={cn("bg-secondary rounded-md p-2", { "bg-muted": isToday })}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-date={day.toDateString()}
    >
      {renderDay ? renderDay(day, isToday) : defaultRender(day, isToday)}
    </div>
  );
}
