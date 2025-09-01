import { useEffect, useRef, useState } from "react";

import type { ReactNode } from "react";
import type { InfiniteScrollProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { useModeEffects } from "../hooks/use-mode-effects";
import { useScrollHandler } from "../hooks/use-scroll-handler";
import { weekToIndex } from "../utils/helper-date";
import { WrapperWeekRow } from "./wrapper-week-row";

export function InfiniteScroll({ children }: InfiniteScrollProps) {
  const { rowHeight, weeksPerScreen, overScan, mode } = useCalendar();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [didInitialScroll, setDidInitialScroll] = useState(false);

  const today = new Date();
  const todayWeekIndex = weekToIndex(today);

  const BUFFER_WEEKS = Math.max(weeksPerScreen, 1);
  const [minWeekIndex, setMinWeekIndex] = useState(() =>
    mode === "date" ? todayWeekIndex - BUFFER_WEEKS : 0,
  );
  const [maxWeekIndex, setMaxWeekIndex] = useState(() =>
    mode === "date" ? todayWeekIndex + BUFFER_WEEKS : 52,
  );

  const viewportHeight = rowHeight * weeksPerScreen;
  const [scrollTop, setScrollTop] = useState(0);

  // Hook up scroll handler
  const currentScrollTop = useScrollHandler({ containerRef });

  // Sync into local state for useInitialScroll
  useEffect(() => {
    setScrollTop(currentScrollTop);
  }, [currentScrollTop]);

  // Use a mode-safe hook to call effects without conditional hooks.
  useModeEffects(
    {
      containerRef,
      rowHeight,
      todayWeekIndex,
      minWeekIndex,
      setScrollTop,
      weeksPerScreen,
      onDidInitialScroll: () => setDidInitialScroll(true),
    },
    {
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
    },
    mode === "date",
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
