import { useCallback, useEffect, useRef, useState } from "react";

import type { ReactNode } from "react";
import type { InfiniteScrollProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { weekToIndex } from "../utils/helper-date";

export function InfiniteScroll({ children }: InfiniteScrollProps) {
  const { rowHeight, weeksPerScreen, overScan } = useCalendar();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Small buffer as you requested
  const BUFFER_WEEKS = Math.max(weeksPerScreen, 1);

  const today = new Date();
  const todayWeekIndex = weekToIndex(today);

  // initial window around today: include some weeks above so user can scroll up
  const [minWeekIndex, setMinWeekIndex] = useState<number>(
    () => todayWeekIndex - BUFFER_WEEKS,
  );
  const [maxWeekIndex, setMaxWeekIndex] = useState<number>(
    () => todayWeekIndex + BUFFER_WEEKS,
  );

  const totalWeeks = maxWeekIndex - minWeekIndex + 1;
  const viewportHeight = rowHeight * weeksPerScreen;

  // scroll state (throttled)
  const [scrollTop, setScrollTop] = useState<number>(0);
  const ticking = useRef(false);

  // Handler: rAF throttle
  const onScroll = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setScrollTop(node.scrollTop);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  // Attach scroll listener and set initial scroll so today's week is FIRST visible row (top)
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.addEventListener("scroll", onScroll, { passive: true });

    // ensure virtual inner exists; schedule initial scroll at next frame to be safe
    requestAnimationFrame(() => {
      // offset from start-of-virtual (minWeekIndex) to today
      const initialOffsetWeeks = todayWeekIndex - minWeekIndex + 1;
      const initialTop = initialOffsetWeeks * rowHeight;
      node.scrollTop = initialTop;
      setScrollTop(initialTop);
    });

    return () => node.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onScroll, rowHeight, minWeekIndex, todayWeekIndex]);

  // Lazy expansion: expand when near edges
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const totalHeight = totalWeeks * rowHeight;
    const topThreshold = BUFFER_WEEKS * rowHeight;
    const bottomThreshold =
      totalHeight - viewportHeight - BUFFER_WEEKS * rowHeight;

    // expand up (prepend)
    if (scrollTop < topThreshold) {
      // expand up by BUFFER_WEEKS
      setMinWeekIndex((prev) => {
        const next = prev - BUFFER_WEEKS;
        // after DOM updates, shift scrollTop down by BUFFER_WEEKS * rowHeight to preserve visible content
        requestAnimationFrame(() => {
          if (!node) return;
          node.scrollTop = node.scrollTop + BUFFER_WEEKS * rowHeight;
          // update local state
          setScrollTop(node.scrollTop);
        });
        return next;
      });
      return;
    }

    // expand down (append)
    if (scrollTop > bottomThreshold) {
      setMaxWeekIndex((prev) => prev + BUFFER_WEEKS);
      return;
    }
  }, [
    scrollTop,
    totalWeeks,
    rowHeight,
    viewportHeight,
    BUFFER_WEEKS,
    setMinWeekIndex,
  ]);

  // compute visible offsets (clamped)
  const firstVisibleOffset = Math.max(0, Math.floor(scrollTop / rowHeight));
  const startOffset = Math.max(0, firstVisibleOffset - overScan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overScan * 2;
  const endOffset = Math.min(totalWeeks - 1, startOffset + visibleCount - 1);

  // render visible week rows
  const items: ReactNode[] = [];
  for (let offset = startOffset; offset <= endOffset; offset++) {
    const weekIndex = minWeekIndex + offset;
    const top = offset * rowHeight;
    items.push(
      <div
        key={`week-${weekIndex}`}
        style={{
          position: "absolute",
          top,
          left: 0,
          right: 0,
          height: rowHeight,
        }}
      >
        {children(weekIndex)}
      </div>,
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-y-scroll border-l border-foreground"
      style={{ height: viewportHeight }}
    >
      <div style={{ position: "relative", height: totalWeeks * rowHeight }}>
        {items}
      </div>
    </div>
  );
}
