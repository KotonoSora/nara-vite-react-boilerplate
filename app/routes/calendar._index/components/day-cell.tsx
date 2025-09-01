import { useCallback } from "react";

import type { DayCellProps } from "../types/type";

import { cn } from "~/lib/utils";

import { useCalendar } from "../context/calendar-context";

export function DayCell({ day, isToday, dayGlobalIndex }: DayCellProps) {
  const { mode } = useCalendar();

  /**
   * Render the date name label based on mode sequence
   */
  const renderDateNameLabel = useCallback(() => {
    // Render the date name label based on mode sequence
    if (mode === "sequence" && typeof dayGlobalIndex === "number") {
      return (
        <div className="bg-secondary rounded-md p-2" data-date={dayGlobalIndex}>
          <div className="text-sm">{dayGlobalIndex + 1}</div>
        </div>
      );
    }

    // Render the date format name based on mode date
    if (mode === "date" && day) {
      const isFirstDay = day.getDate() === 1;

      const needsYear = day.getFullYear() !== new Date().getFullYear();
      const fmt = new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        ...(isFirstDay ? { month: "2-digit" } : {}),
        ...(isFirstDay && needsYear ? { year: "numeric" } : {}),
      } as Intl.DateTimeFormatOptions);

      const dateString = fmt.format(day);

      return (
        <div
          className={cn("text-sm px-1", {
            "rounded-xl text-center flex flex-col items-center justify-start font-bold bg-primary text-primary-foreground":
              isToday,
            "font-bold": isFirstDay,
          })}
        >
          {dateString}
        </div>
      );
    }

    // Default to empty
    return null;
  }, [day, isToday, dayGlobalIndex, mode]);

  return (
    <div
      className={cn(
        "relative bg-secondary rounded-md flex flex-col h-full min-h-0 ",
      )}
      aria-label="date-wrapper"
    >
      <div className="flex flex-row min-w-0 p-2" aria-label="date-title">
        {renderDateNameLabel()}
      </div>
      <div
        className="flex flex-col flex-1 min-h-0 h-full bg-1"
        aria-label="date-content"
      >
        {/* Render children date content */}
      </div>
    </div>
  );
}
