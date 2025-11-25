import { addMonths, startOfMonth, subMonths } from "date-fns";
import { useRef, useState } from "react";

import type { VirtuosoGridHandle } from "react-virtuoso";

import type {
  CurrentMonthNavigationProps,
  CurrentMonthNavigationReturn,
} from "../types/hook";

import { isRTLLanguage } from "~/lib/i18n/utils/common/is-rtl-language";
import { formatMonthLabelByLanguage } from "~/lib/i18n/utils/datetime/format-month-label-by-language";
import { getWeekDayLabels } from "~/lib/i18n/utils/datetime/get-week-day-labels";
import { getWeekStartsOnByLanguage } from "~/lib/i18n/utils/datetime/get-week-starts-on-by-language";

import { getIndexCurrentMonth } from "../utils/get-index-current-month";
import { getStartDateFirstWeekOfYear } from "../utils/get-start-date-first-week-of-year";

export function useCurrentMonthNavigation({
  initialDate,
  language,
}: CurrentMonthNavigationProps): CurrentMonthNavigationReturn {
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

  const virtuosoRef = useRef<VirtuosoGridHandle | null>(null);

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

  const direction = isRTLLanguage(language) ? "rtl" : "ltr";

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
