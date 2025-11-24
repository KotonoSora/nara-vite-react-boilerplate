import {
  addDays,
  differenceInWeeks,
  endOfMonth,
  endOfYear,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { VirtuosoGrid } from "react-virtuoso";

import type { Day } from "date-fns";
import type { JSX } from "react";
import type { VirtuosoGridHandle, VirtuosoGridProps } from "react-virtuoso";

import type { SupportedLanguage } from "~/lib/i18n/types/common";

import { Button } from "~/components/ui/button";
import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import { useLanguage } from "~/lib/i18n/hooks/use-language";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";
import { formatNumber } from "~/lib/i18n/utils/number/format-number";

import { useCurrentMonthNavigation } from "./hooks/use-current-month-navigation";

/**
 * Grid components for VirtuosoGrid
 * Defined outside component to prevent remounting on each render
 */
const gridComponents: VirtuosoGridProps<Date, undefined>["components"] = {
  List: forwardRef(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: "flex",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }) => (
    <div
      {...props}
      style={{
        width: "14.285714%", // 100% / 7 days
        display: "block",
        alignContent: "stretch",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  ),
};

function MonthNavigation({
  goToToday,
  goToNextMonth,
  goToPrevMonth,
  monthLabel,
  direction,
}: {
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  monthLabel: string;
  direction: "ltr" | "rtl";
}): JSX.Element {
  const t = useTranslation();

  return (
    <div className="flex flex-1 shrink-0 flex-row justify-between items-center p-2 relative">
      <div className="flex flex-row gap-2 items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
          onClick={goToPrevMonth}
          aria-label={t("calendar.common.previousMonth")}
          data-label={t("calendar.common.previousMonth")}
        >
          {direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={goToToday}
          aria-label="Today"
          data-label="Today"
        >
          {t("calendar.common.today")}
        </Button>
      </div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        aria-label={monthLabel}
        data-label={monthLabel}
      >
        {monthLabel}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="cursor-pointer"
        onClick={goToNextMonth}
        aria-label={t("calendar.common.nextMonth")}
        data-label={t("calendar.common.nextMonth")}
      >
        {direction === "rtl" ? <ChevronLeft /> : <ChevronRight />}
      </Button>
    </div>
  );
}

function WeekdayHeaders({ weekDays }: { weekDays: string[] }): JSX.Element {
  return (
    <div className="flex flex-1 shrink-0 flex-row justify-between items-center border-b">
      {weekDays.map((day) => (
        <div
          key={day}
          className="flex flex-1 shrink-0 justify-center items-center border-l first:border-l-0"
          aria-label={day}
          data-label={day}
        >
          {day}
        </div>
      ))}
    </div>
  );
}

/**
 * DayGrids component renders all weeks of the year using VirtuosoGrid
 * Each week is rendered as a row with 7 day items
 */
function DayGrids({
  firstDayOfMonth,
  weekStartsOn,
  language,
}: {
  firstDayOfMonth: Date;
  weekStartsOn: number;
  language: SupportedLanguage;
}): JSX.Element {
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);

  /**
   * Calculate all days to render for the current year
   * Starting from the first week that contains the year start date
   * Ending at the last week that contains the year end date
   */
  const { allDays, currentWeekIndex } = useMemo(() => {
    const yearStart = startOfYear(firstDayOfMonth);
    const yearEnd = endOfYear(firstDayOfMonth);

    // Get the first day of the first week of the year
    const firstWeekStart = startOfWeek(yearStart, {
      weekStartsOn: weekStartsOn as Day,
    });

    // Get the last day of the last week of the year (add 6 days to week start)
    const lastWeekStart = startOfWeek(yearEnd, {
      weekStartsOn: weekStartsOn as Day,
    });

    // Calculate total weeks in the year
    const totalWeeks = differenceInWeeks(lastWeekStart, firstWeekStart) + 1;

    // Calculate the current week index (week containing firstDayOfMonth)
    const currentWeekStart = startOfWeek(firstDayOfMonth, {
      weekStartsOn: weekStartsOn as Day,
    });
    const weekIndex = differenceInWeeks(currentWeekStart, firstWeekStart);

    // Generate all days (weeks * 7 days)
    const days: Date[] = [];
    for (let week = 0; week < totalWeeks; week++) {
      for (let day = 0; day < 7; day++) {
        const dayIndex = week * 7 + day;
        const currentDay = addDays(firstWeekStart, dayIndex);
        days.push(currentDay);
      }
    }

    return { allDays: days, currentWeekIndex: weekIndex, totalWeeks };
  }, [firstDayOfMonth, weekStartsOn]);

  /**
   * Calculate dynamic height based on total weeks in the current month
   * Each day cell has min-h-[100px] + padding + border
   */
  const gridHeight = useMemo(() => {
    const monthStart = startOfMonth(firstDayOfMonth);
    const monthEnd = endOfMonth(firstDayOfMonth);

    // Get the first day of the first week of the month
    const firstWeekStart = startOfWeek(monthStart, {
      weekStartsOn: weekStartsOn as Day,
    });

    // Get the last week start of the month
    const lastWeekStart = startOfWeek(monthEnd, {
      weekStartsOn: weekStartsOn as Day,
    });

    // Calculate total weeks in the current month
    const weeksInMonth = differenceInWeeks(lastWeekStart, firstWeekStart) + 1;

    const dayItemHeight = 100;
    const itemTotalHeight = dayItemHeight;
    return weeksInMonth * itemTotalHeight;
  }, [firstDayOfMonth, weekStartsOn]);

  /**
   * Scroll to the current week when the component mounts or firstDayOfMonth changes
   */
  useEffect(() => {
    if (virtuosoRef.current && currentWeekIndex >= 0) {
      // Calculate the index of the first day of the current week (week * 7 days)
      const scrollIndex = currentWeekIndex * 7;

      // Scroll to the current week with a slight delay to ensure grid is ready
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: scrollIndex,
          align: "start",
          behavior: "auto",
        });
      }, 0);
    }
  }, [currentWeekIndex, firstDayOfMonth]);

  /**
   * Render each day cell in the grid
   */
  const itemContent = (index: number) => {
    const day = allDays[index];
    const dayNumber = format(day, "d");
    const isCurrentMonth = isSameMonth(day, firstDayOfMonth);
    const isTodayDate = isToday(day);

    return (
      <div
        className={`
          flex flex-col items-center justify-center
          min-h-[100px] p-2 border border-gray-200 dark:border-gray-700
          transition-colors
          ${!isCurrentMonth ? "text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900" : ""}
          ${isTodayDate ? "bg-blue-100 dark:bg-blue-900 font-bold" : ""}
        `}
        aria-label={format(day, "MMMM d, yyyy")}
        data-date={format(day, "yyyy-MM-dd")}
      >
        <span
          className={`text-lg ${isTodayDate ? "text-blue-600 dark:text-blue-300" : ""}`}
        >
          {formatNumber(parseInt(dayNumber), language)}
        </span>
      </div>
    );
  };

  return (
    <VirtuosoGrid
      ref={virtuosoRef}
      style={{ height: gridHeight }}
      totalCount={allDays.length}
      components={gridComponents}
      itemContent={itemContent}
      initialTopMostItemIndex={currentWeekIndex * 7}
    />
  );
}

export function ContentCalendarInfinityPage(): JSX.Element {
  const { language } = useLanguage();
  const {
    firstDayOfMonth,
    goToToday,
    goToNextMonth,
    goToPrevMonth,
    weekDays,
    monthLabel,
    weekStartsOn,
    direction,
  } = useCurrentMonthNavigation({ language });

  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      {/* Header navigation */}
      <HeaderNavigation />

      {/* Month navigation */}
      <section className="container mx-auto sticky top-14 z-40 bg-white dark:bg-black">
        <MonthNavigation
          goToToday={goToToday}
          goToNextMonth={goToNextMonth}
          goToPrevMonth={goToPrevMonth}
          monthLabel={monthLabel}
          direction={direction}
        />
      </section>

      {/* Weekday headers */}
      <section className="container mx-auto sticky top-26 z-30 bg-white dark:bg-black">
        <WeekdayHeaders weekDays={weekDays} />
      </section>

      {/* Calendar content */}
      <section className="container mx-auto">
        <DayGrids
          firstDayOfMonth={firstDayOfMonth}
          weekStartsOn={weekStartsOn}
          language={language}
        />
      </section>

      {/* Footer section */}
      <FooterSection />
    </main>
  );
}
