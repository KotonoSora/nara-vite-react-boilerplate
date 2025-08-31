import { useEffect, useRef, useState } from "react";

import type { ReactNode } from "react";
import type { InfiniteScrollProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { useInitialScroll } from "../hooks/use-initial-scroll";
import { useLazyExpansion } from "../hooks/use-lazy-expansion";
import { useScrollHandler } from "../hooks/use-scroll-handler";
import { weekToIndex } from "../utils/helper-date";
import { WrapperWeekRow } from "./wrapper-week-row";

export function InfiniteScroll({ children }: InfiniteScrollProps) {
  const { rowHeight, weeksPerScreen, overScan } = useCalendar();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [didInitialScroll, setDidInitialScroll] = useState(false);

  const today = new Date();
  const todayWeekIndex = weekToIndex(today);

  const BUFFER_WEEKS = Math.max(weeksPerScreen, 1);
  const [minWeekIndex, setMinWeekIndex] = useState(
    todayWeekIndex - BUFFER_WEEKS,
  );
  const [maxWeekIndex, setMaxWeekIndex] = useState(
    todayWeekIndex + BUFFER_WEEKS,
  );

  const viewportHeight = rowHeight * weeksPerScreen;
  const [scrollTop, setScrollTop] = useState(0);

  // Hook up scroll handler
  const currentScrollTop = useScrollHandler(containerRef);

  // Sync into local state for useInitialScroll
  useEffect(() => {
    setScrollTop(currentScrollTop);
  }, [currentScrollTop]);

  // Initial scroll to today
  useInitialScroll(
    containerRef,
    rowHeight,
    todayWeekIndex,
    minWeekIndex,
    setScrollTop,
    weeksPerScreen,
    () => setDidInitialScroll(true),
  );

  // Lazy expansion
  useLazyExpansion(
    scrollTop,
    rowHeight,
    viewportHeight,
    weeksPerScreen,
    minWeekIndex,
    maxWeekIndex,
    setMinWeekIndex,
    setMaxWeekIndex,
    containerRef,
    didInitialScroll,
  );

  // Render visible rows
  const totalWeeks = maxWeekIndex - minWeekIndex + 1;
  const firstVisibleOffset = Math.max(0, Math.floor(scrollTop / rowHeight));
  const startOffset = Math.max(0, firstVisibleOffset - overScan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overScan * 2;
  const endOffset = Math.min(totalWeeks - 1, startOffset + visibleCount - 1);

  const items: ReactNode[] = [];
  for (let offset = startOffset; offset <= endOffset; offset++) {
    const weekIndex = minWeekIndex + offset;
    items.push(
      <WrapperWeekRow
        key={`week-${weekIndex}`}
        weekIndex={weekIndex}
        offset={offset}
        rowHeight={rowHeight}
      >
        {children(weekIndex)}
      </WrapperWeekRow>,
    );
  }

  return (
    <div
      ref={containerRef}
      data-infinite-scroll-container
      className="relative overflow-y-scroll"
      style={{ height: viewportHeight }}
    >
      <div
        style={{
          position: "relative",
          height: totalWeeks * rowHeight,
        }}
      >
        {items}
      </div>
    </div>
  );
}
