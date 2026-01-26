import { cn } from "@kotonosora/ui/lib/utils";

import type { DayCellProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { dayToIndex, startOfDay } from "../utils/helper-date";

export function DayCell({ day, dayGlobalIndex, renderDay }: DayCellProps) {
  const { mode, todayDayIndex, today } = useCalendar();

  // Compute a stable global day index: prefer explicit prop, otherwise derive from `day`.
  const computedGlobalDayIndex =
    typeof dayGlobalIndex === "number"
      ? dayGlobalIndex
      : day
        ? dayToIndex(day)
        : undefined;

  const todayStart = startOfDay(today).getTime();
  const isToday = day
    ? startOfDay(day).getTime() === todayStart
    : typeof computedGlobalDayIndex === "number" &&
      computedGlobalDayIndex === todayDayIndex;

  const currentYear = today.getFullYear();

  // Create the label based on mode and day information
  let dateNameLabel = null;

  if (mode === "sequence" && typeof computedGlobalDayIndex === "number") {
    dateNameLabel = (
      <div
        className="bg-secondary rounded-md p-2"
        data-date={computedGlobalDayIndex}
      >
        <div className="text-sm">{computedGlobalDayIndex + 1}</div>
      </div>
    );
  } else if (mode === "date" && day) {
    const isFirstDay = day.getDate() === 1;
    const needsYear = day.getFullYear() !== currentYear;

    const fmt = new Intl.DateTimeFormat(undefined, {
      day: "2-digit",
      ...(isFirstDay ? { month: "2-digit" } : {}),
      ...(isFirstDay && needsYear ? { year: "numeric" } : {}),
    } as Intl.DateTimeFormatOptions);

    const dateString = fmt.format(day);

    dateNameLabel = (
      <div
        className={cn("text-sm", {
          "rounded-xl text-center flex flex-col items-center justify-start font-bold bg-primary text-primary-foreground px-1":
            isToday,
          "font-bold": isFirstDay,
        })}
      >
        {dateString}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative bg-secondary rounded-md flex flex-col h-full min-h-0 ",
      )}
      aria-label="date-wrapper"
    >
      <div className="flex flex-row min-w-0 p-2" aria-label="date-title">
        {dateNameLabel}
      </div>
      <div
        className="flex flex-col flex-1 min-h-0 h-full bg-1"
        aria-label="date-content"
      >
        {/* Render custom day content when provided */}
        {renderDay ? renderDay({ day, dayGlobalIndex, isToday }) : null}
      </div>
    </div>
  );
}
