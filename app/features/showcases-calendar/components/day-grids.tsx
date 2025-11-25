import { VirtuosoGrid } from "react-virtuoso";

import type { DayGridsProps } from "../types/component";

import { calculateCalendarDisplayHeight } from "../utils/calculate-calendar-display-height";
import { getIndexCurrentMonth } from "../utils/get-index-current-month";
import { getStartDateFirstWeekOfYear } from "../utils/get-start-date-first-week-of-year";
import { getStartDateLastWeekOfYear } from "../utils/get-start-date-last-week-of-year";
import { getTotalWeeksInRange } from "../utils/get-total-weeks-in-range";
import { GridComponents } from "./grid-components";
import { ItemContent } from "./item-content";

export function DayGrids({
  firstDayOfMonth,
  weekStartsOn,
  language,
  virtuosoRef,
}: DayGridsProps) {
  const startDateFirstWeekOfYear = getStartDateFirstWeekOfYear({
    date: firstDayOfMonth,
    weekStartsOn,
  });

  const startDateLastWeekOfYear = getStartDateLastWeekOfYear({
    date: firstDayOfMonth,
    weekStartsOn,
  });

  const totalWeeksOfYear = getTotalWeeksInRange({
    start: startDateFirstWeekOfYear,
    end: startDateLastWeekOfYear,
  });

  const calendarDisplayHeight = calculateCalendarDisplayHeight({
    date: firstDayOfMonth,
    weekStartsOn,
    itemHeight: 80,
  });

  const indexCurrentMonth = getIndexCurrentMonth({
    start: startDateFirstWeekOfYear,
    date: firstDayOfMonth,
    weekStartsOn,
  });

  const renderCalendarItem = (index: number) => (
    <ItemContent
      dayIndex={index}
      start={startDateFirstWeekOfYear}
      current={firstDayOfMonth}
      language={language}
    />
  );

  return (
    <VirtuosoGrid
      ref={virtuosoRef}
      style={{ height: calendarDisplayHeight }}
      totalCount={totalWeeksOfYear * 7}
      components={GridComponents}
      itemContent={renderCalendarItem}
      initialTopMostItemIndex={indexCurrentMonth * 7}
    />
  );
}
