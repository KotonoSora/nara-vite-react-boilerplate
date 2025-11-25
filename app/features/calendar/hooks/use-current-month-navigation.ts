import { addMonths, startOfMonth, subMonths } from "date-fns";
import { useRef, useState } from "react";

import type { Day } from "date-fns";
import type { RefObject } from "react";
import type { VirtuosoGridHandle } from "react-virtuoso";

import type { SupportedLanguage } from "~/lib/i18n/types/common";

import { getIndexCurrentMonth } from "~/features/calendar/utils/get-index-current-month";
import { getStartDateFirstWeekOfYear } from "~/features/calendar/utils/get-start-date-first-week-of-year";
import { isRTLLanguage } from "~/lib/i18n/utils/common/is-rtl-language";
import { formatMonthLabelByLanguage } from "~/lib/i18n/utils/datetime/format-month-label-by-language";
import { getWeekDayLabels } from "~/lib/i18n/utils/datetime/get-week-day-labels";
import { getWeekStartsOnByLanguage } from "~/lib/i18n/utils/datetime/get-week-starts-on-by-language";

/**
 * A custom React hook for managing calendar month navigation and localization.
 *
 * This hook provides utilities to navigate between months, reset to the current month,
 * and retrieve localized labels for the current month and weekdays. It ensures the
 * current date is always set to the first day of the month at midnight.
 *
 * @function useCurrentMonthNavigation
 * @param {Object} options - Optional configuration object.
 * @param {Date|string|number|null} [options.initialDate] - The initial date to display (can be a Date, string, number, or null). Defaults to the current month.
 * @param {SupportedLanguage|string} [options.language] - The language code for localization (e.g., 'en', 'fr'). Optional.
 *
 * @returns An object containing:
 * - `firstDayOfMonth`: The current month as a Date object (always the first day of the month).
 * - `goToToday`: Function to reset the view to the current month.
 * - `goToNextMonth`: Function to navigate to the next month.
 * - `goToPrevMonth`: Function to navigate to the previous month.
 * - `weekDays`: An array of localized weekday labels (short format).
 * - `monthLabel`: A localized label for the current month (long format).
 * - `weekStartsOn`: The day the week starts on, based on the language.
 * - `direction`: Text direction ('ltr' or 'rtl') based on the language.
 * - `virtuosoRef`: Ref attached to the virtualized grid for imperative scrolling.
 */
export function useCurrentMonthNavigation({
  initialDate,
  language = "en",
}: {
  initialDate?: Date | string | number | null;
  language?: SupportedLanguage | string;
} = {}): {
  firstDayOfMonth: Date;
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  weekDays: string[];
  monthLabel: string;
  weekStartsOn: Day;
  direction: "ltr" | "rtl";
  virtuosoRef: RefObject<VirtuosoGridHandle | null>;
} {
  const getInitialDate = (): Date => {
    if (!initialDate) return startOfMonth(new Date());

    const date = new Date(initialDate);
    if (isNaN(date.getTime())) return startOfMonth(new Date());

    return startOfMonth(date);
  };

  const [firstDayOfMonth, setFirstDayOfMonth] = useState<Date>(getInitialDate);

  const weekStartsOn = getWeekStartsOnByLanguage({
    language,
  });

  const virtuosoRef = useRef<VirtuosoGridHandle>(null);

  const scrollToMonthStart = (targetDate: Date) => {
    if (!virtuosoRef.current) return;

    const normalizedDate = startOfMonth(targetDate);
    const startDateFirstWeekOfYear = getStartDateFirstWeekOfYear({
      date: normalizedDate,
      weekStartsOn,
    });
    const monthIndex = getIndexCurrentMonth({
      start: startDateFirstWeekOfYear,
      date: normalizedDate,
      weekStartsOn,
    });

    if (monthIndex < 0) return;

    virtuosoRef.current.scrollToIndex({
      index: monthIndex * 7,
      align: "start",
      behavior: "auto",
    });
  };

  const goToToday = () => {
    const today = startOfMonth(new Date());
    setFirstDayOfMonth(today);
    scrollToMonthStart(today);
  };

  const goToNextMonth = () => {
    setFirstDayOfMonth((previousMonth) => {
      const nextMonth = startOfMonth(addMonths(previousMonth, 1));
      scrollToMonthStart(nextMonth);
      return nextMonth;
    });
  };

  const goToPrevMonth = () => {
    setFirstDayOfMonth((previousMonth) => {
      const previousMonthDate = startOfMonth(subMonths(previousMonth, 1));
      scrollToMonthStart(previousMonthDate);
      return previousMonthDate;
    });
  };

  const weekDays = getWeekDayLabels({
    language,
    formatStyle: "short",
  });

  const monthLabel = formatMonthLabelByLanguage({
    date: firstDayOfMonth,
    language,
    formatStyle: "long",
  });

  const direction = isRTLLanguage((language as SupportedLanguage) || "en")
    ? "rtl"
    : "ltr";

  return {
    firstDayOfMonth, // always day 1 of the current month, at 00:00:00.000
    goToToday,
    goToNextMonth,
    goToPrevMonth,
    monthLabel,
    weekDays,
    weekStartsOn,
    direction,
    virtuosoRef,
  };
}
