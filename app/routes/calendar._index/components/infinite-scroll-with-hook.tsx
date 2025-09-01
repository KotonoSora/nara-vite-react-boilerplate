import { useEffect, useMemo, useRef, useState } from "react";

import type { ReactNode } from "react";
import type { InfiniteScrollProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { useModeEffects } from "../hooks/use-mode-effects";
import { useScrollHandler } from "../hooks/use-scroll-handler";
import { indexToWeek, weekToIndex } from "../utils/helper-date";
import { WrapperWeekRow } from "./wrapper-week-row";

export function InfiniteScroll({ children }: InfiniteScrollProps) {
  const { rowHeight, weeksPerScreen, overScan, mode } = useCalendar();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [didInitialScroll, setDidInitialScroll] = useState(false);

  // Only compute today/week index when in date mode to reduce allocations
  const todayWeekIndex = useMemo<number | undefined>(() => {
    if (mode !== "date") return undefined;
    return weekToIndex(new Date());
  }, [mode]);

  const BUFFER_WEEKS = Math.max(weeksPerScreen, 1);
  const [minWeekIndex, setMinWeekIndex] = useState(() =>
    mode === "date" && typeof todayWeekIndex === "number"
      ? todayWeekIndex - BUFFER_WEEKS
      : 0,
  );
  const [maxWeekIndex, setMaxWeekIndex] = useState(() =>
    mode === "date" && typeof todayWeekIndex === "number"
      ? todayWeekIndex + BUFFER_WEEKS
      : 52,
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

  // Memoize the visible range calculations so they only run when inputs change.
  const visibleRange = useMemo(() => {
    const totalWeeks = maxWeekIndex - minWeekIndex + 1;
    const firstVisibleOffset = Math.max(0, Math.floor(scrollTop / rowHeight));
    const startOffset = Math.max(0, firstVisibleOffset - overScan);
    const visibleCount = Math.ceil(viewportHeight / rowHeight) + overScan * 2;
    const endOffset = Math.min(totalWeeks - 1, startOffset + visibleCount - 1);
    return { totalWeeks, startOffset, endOffset };
  }, [
    minWeekIndex,
    maxWeekIndex,
    scrollTop,
    rowHeight,
    viewportHeight,
    overScan,
  ]);

  // Calculate the visible window for the label display.
  const visibleWindow = useMemo(() => {
    const firstVisibleOffset = Math.max(0, Math.floor(scrollTop / rowHeight));
    const visibleCount = Math.ceil(viewportHeight / rowHeight);
    const firstWeekIndex = minWeekIndex + firstVisibleOffset;
    const lastWeekIndex = Math.min(
      maxWeekIndex,
      firstWeekIndex + visibleCount - 1,
    );
    return { firstWeekIndex, lastWeekIndex };
  }, [scrollTop, rowHeight, viewportHeight, minWeekIndex, maxWeekIndex]);

  // Calculate the visible label for the currently-viewed range.
  const visibleLabel = useMemo(() => {
    const { firstWeekIndex, lastWeekIndex } = visibleWindow;

    // Sequence mode shows week numbers instead of date ranges.
    if (mode === "sequence") {
      const totalWeeks = visibleRange.totalWeeks;
      const firstNumber = firstWeekIndex - minWeekIndex + 1;
      const lastNumber = lastWeekIndex - minWeekIndex + 1;
      return `Week ${firstNumber} - ${lastNumber} of ${totalWeeks}`;
    }

    const start = indexToWeek(firstWeekIndex);
    const endWeekStart = indexToWeek(lastWeekIndex);
    const end = new Date(endWeekStart);
    end.setDate(end.getDate() + 6);

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    const startStr = start.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
    });
    const endStr = end.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
    });

    if (startYear !== endYear) {
      return `${startStr}, ${startYear} - ${endStr}, ${endYear}`;
    }
    return `${startStr} - ${endStr}, ${endYear}`;
  }, [visibleWindow, mode, visibleRange.totalWeeks, minWeekIndex]);

  // Memoize items array to avoid reallocating on every render when the
  // visible window hasn't changed.
  const items = useMemo<ReactNode[]>(() => {
    const list: ReactNode[] = [];
    for (
      let offset = visibleRange.startOffset;
      offset <= visibleRange.endOffset;
      offset++
    ) {
      const weekIndex = minWeekIndex + offset;
      list.push(
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
    return list;
  }, [
    visibleRange.startOffset,
    visibleRange.endOffset,
    minWeekIndex,
    rowHeight,
    children,
  ]);

  return (
    <>
      {/* Visible weeks label */}
      <div className="absolute left-1/2 top-2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-card text-card-foreground px-3 py-1 rounded-md text-sm shadow">
          {visibleLabel}
        </div>
      </div>

      {/* Infinite scroll container */}
      <div
        ref={containerRef}
        data-infinite-scroll-container
        className="relative overflow-y-scroll"
        style={{ height: viewportHeight }}
        aria-label="infinity-scroll-scrollable"
      >
        <div
          className="relative"
          style={{
            height: visibleRange.totalWeeks * rowHeight,
          }}
          aria-label="infinity-scroll-content-wrapper"
        >
          {items}
        </div>
      </div>
    </>
  );
}
