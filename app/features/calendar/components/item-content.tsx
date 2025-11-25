import { addDays, format, isSameMonth, isToday } from "date-fns";

import type { SupportedLanguage } from "~/lib/i18n/types/common";

import { formatFirstDayOfMonthByLanguage } from "~/lib/i18n/utils/datetime/format-first-day-of-month-by-language";
import { formatNumber } from "~/lib/i18n/utils/number/format-number";
import { cn } from "~/lib/utils";

type ItemContentProps = {
  dayIndex: number;
  start: Date;
  current: Date;
  language: SupportedLanguage;
};

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
