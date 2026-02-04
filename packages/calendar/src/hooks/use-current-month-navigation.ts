import {
  formatMonthLabelByLanguage,
  getWeekDayLabels,
  getWeekStartsOnByLanguage,
  isRTLLanguage,
} from "@kotonosora/i18n";
import { addMonths, startOfMonth, subMonths } from "date-fns";
import { useEffect, useRef, useState } from "react";

import type { Day } from "date-fns";
import type { VirtuosoGridHandle } from "react-virtuoso";

import type {
  CurrentMonthNavigationProps,
  CurrentMonthNavigationReturn,
} from "../types/hook";

import { getIndexCurrentMonth } from "../utils/get-index-current-month";
import { getStartDateFirstWeekOfYear } from "../utils/get-start-date-first-week-of-year";

export function useCurrentMonthNavigation({
  initialDate,
  language,
}: CurrentMonthNavigationProps): CurrentMonthNavigationReturn {
  /**
   * Derive a safe Date representing the first day of the intended month.
   * Falls back to the current month when input is invalid or missing.
   */
  const getInitialDate = (): Date => {
    if (!initialDate) return startOfMonth(new Date());

    const date = new Date(initialDate);
    if (isNaN(date.getTime())) return startOfMonth(new Date());

    return startOfMonth(date);
  };

  const [firstDayOfMonth, setFirstDayOfMonth] = useState<Date>(getInitialDate);
  /**
   * Store week configuration/labels derived asynchronously from language.
   * Defaults ensure consistent behavior before async resolution.
   */
  const [weekStartsOn, setWeekStartsOn] = useState<Day>(0 as Day);
  const [weekDays, setWeekDays] = useState<string[]>([]);

  const virtuosoRef = useRef<VirtuosoGridHandle | null>(null);

  /**
   * Scroll the grid to the start index of the target month.
   * No-op until a valid ref exists. Uses current `weekStartsOn` state.
   */
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

  /**
   * Resolve async language-driven week configuration and labels.
   * Updates whenever `language` changes; guards against stale updates.
   */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [resolvedWeekStartsOn, resolvedWeekDays] = await Promise.all([
          getWeekStartsOnByLanguage({ language }),
          getWeekDayLabels({ language, formatStyle: "short" }),
        ]);
        if (!cancelled) {
          setWeekStartsOn(resolvedWeekStartsOn);
          setWeekDays(resolvedWeekDays);
        }
      } catch {
        // Keep safe defaults on error; intentionally silent.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [language]);

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
