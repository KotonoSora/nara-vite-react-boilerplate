import {
  formatFirstDayOfMonthByLanguage,
  formatNumber,
} from "@kotonosora/i18n";
import { cn } from "@kotonosora/ui/lib/utils";
import { addDays, format, isSameMonth, isToday } from "date-fns";

import type { ItemContentProps } from "../types/component";

export function ItemContent({
  dayIndex,
  start,
  current,
  language,
}: ItemContentProps) {
  const calendarDate = addDays(start, dayIndex);
  const dayNumber = format(calendarDate, "d");
  const isWithinDisplayedMonth = isSameMonth(calendarDate, current);
  const isCurrentDay = isToday(calendarDate);
  const dayLabel =
    dayNumber !== "1"
      ? formatNumber(Number.parseInt(dayNumber, 10), language)
      : formatFirstDayOfMonthByLanguage({ date: calendarDate, language });
  const ariaLabel = format(calendarDate, "MMMM d, yyyy");
  const dataLabel = format(calendarDate, "yyyy-MM-dd");

  return (
    <div
      className={cn("overflow-hidden h-full px-1 py-0.5 box-border", {
        "text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900":
          !isWithinDisplayedMonth,
        "bg-blue-100 dark:bg-blue-900": isCurrentDay,
      })}
      aria-label={ariaLabel}
      data-label={dataLabel}
    >
      <div className="flex flex-row items-end justify-between">
        <span
          className={cn("text-sm leading-none", {
            "text-blue-600 dark:text-blue-300 font-bold": isCurrentDay,
          })}
        >
          {dayLabel}
        </span>
        <span className="text-xs leading-none"></span>
      </div>
      <div className="text-xs leading-none text-right"></div>
      <div className="text-xs leading-none text-right"></div>
      <div className="text-xs leading-none text-right"></div>
      <div className="text-xs leading-none text-right"></div>
      <div className="text-xs leading-none text-right"></div>
    </div>
  );
}
