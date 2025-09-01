import { useEffect, useMemo, useRef, useState } from "react";

import type { JSX, ReactNode } from "react";
import type { InfiniteScrollProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";
import { useModeEffects } from "../hooks/use-mode-effects";
import { useScrollHandler } from "../hooks/use-scroll-handler";
import { useTodayWeekIndex } from "../hooks/use-today-week-index";
import { useViewportHeight } from "../hooks/use-viewport-height";
import { useVisibleItems } from "../hooks/use-visible-items";
import { useVisibleLabel } from "../hooks/use-visible-label";
import { useVisibleRange } from "../hooks/use-visible-range";
import { useVisibleWindow } from "../hooks/use-visible-window";
import { InfiniteScrollContainer } from "./infinite-scroll-container";
import { VisibleWeeksLabel } from "./visible-weeks-label";
import { WrapperWeekRow } from "./wrapper-week-row";

/**
 * InfiniteScroll
 *
 * Renders a virtualized list of weeks with an infinite-scroll-like experience.
 * Only the rows inside the computed visible window (plus an over-scan) are
 * rendered, which keeps the DOM small and improves performance for long lists.
 *
 * Implementation notes (high-level):
 * - Read calendar settings from context (row height, weeks per screen, mode).
 * - Compute a "buffer" of weeks around the focused week (memoized).
 * - Derive viewport height and visible ranges for virtualization.
 * - Map visible items to row components and render inside a container that
 *   provides the scrollable area and correct offsets.
 *
 * @param {InfiniteScrollProps} props - Component props
 * @param {(weekIndex: number) => ReactNode} props.children - Render prop for a week row
 * @returns {JSX.Element} The infinite scroll container with visible week rows
 */
export function InfiniteScroll({ children }: InfiniteScrollProps): JSX.Element {
  /**
   * CONTRACT (inputs/outputs):
   * - inputs: calendar context (rowHeight, weeksPerScreen, overScan, mode)
   * - outputs: rendered weeks inside the scroll container
   * - error modes: missing context values may lead to fallback ranges (0..52)
   */
  // Read calendar configuration (row height, how many weeks fit on screen, over-scan, and current mode)
  const { rowHeight, weeksPerScreen, overScan, mode } = useCalendar();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // How many weeks to show around the current focus (minimum 1).
  // We memoize this simple derived value so that components/effects which
  // depend on `bufferWeeks` only update when `weeksPerScreen` actually changes.
  // This makes dependency arrays explicit and avoids unnecessary recalculations.
  const bufferWeeks = useMemo(
    () => Math.max(weeksPerScreen, 1),
    [weeksPerScreen],
  );

  const todayWeekIndex = useTodayWeekIndex({ mode });

  // Compute the viewport height in pixels from the row height and how many
  // weeks fit on the screen. This is a derived value used by the virtualization
  // math to determine how many rows are visible at any given scrollTop.
  const viewportHeight = useViewportHeight({ rowHeight, weeksPerScreen });

  // Track whether we've performed the initial programmatic scroll.
  // The initial scroll centers the content around "today" for date mode and
  // should only run once — this flag guards that behavior.
  const [didInitialScroll, setDidInitialScroll] = useState(false);

  // Local copy of the scrollTop in pixels. We keep this in state so that
  // dependent hooks (visible window/range calculations) can run in React's
  // lifecycle rather than reading the DOM synchronously everywhere.
  const [scrollTop, setScrollTop] = useState(0);
  const [minWeekIndex, setMinWeekIndex] = useState(() =>
    mode === "date" && typeof todayWeekIndex === "number"
      ? todayWeekIndex - bufferWeeks
      : 0,
  );
  const [maxWeekIndex, setMaxWeekIndex] = useState(() =>
    mode === "date" && typeof todayWeekIndex === "number"
      ? todayWeekIndex + bufferWeeks
      : 52,
  );

  // Compute the visible range (with over-scan). This hook returns:
  // - totalWeeks: total number of weeks represented by the scrollable content
  // - offsets: array of top offsets for each rendered slot
  // - firstVisibleIndex / lastVisibleIndex: index window that includes over-scan
  // Over-scan ensures a buffer of rendered rows outside the strict viewport
  // to avoid visible pop-in when scrolling.
  const visibleRange = useVisibleRange({
    minWeekIndex,
    maxWeekIndex,
    scrollTop,
    rowHeight,
    viewportHeight,
    overScan,
  });

  // Compute the visible window (no over-scan). This represents the rows that
  // are actually visible in the viewport and is suitable for UI elements like
  // labels where over-scan would be misleading.
  const visibleWindow = useVisibleWindow({
    minWeekIndex,
    maxWeekIndex,
    scrollTop,
    rowHeight,
    viewportHeight,
  });

  // Format a human-friendly label describing the currently visible weeks.
  // We keep that logic in a hook so it can be unit-tested independently and
  // swapped out if localization or formatting rules change.
  const visibleLabel = useVisibleLabel({
    visibleWindow,
    totalWeeks: visibleRange.totalWeeks,
    minWeekIndex,
    mode,
  });

  // Obtain a small array of items to render. Each entry contains the
  // weekIndex and the pixel offset (top) where that row should be positioned.
  // This data is intentionally minimal to keep the rendering step simple.
  const visibleItems = useVisibleItems({ visibleRange, minWeekIndex });

  // Render the visible items. We keep the mapping here (in the component)
  // because rendering concerns (JSX, children render-prop) belong to UI code
  // rather than pure hooks. Memoize to avoid rebuilding elements unnecessarily.
  const items = useMemo<ReactNode[]>(
    () =>
      visibleItems.map(({ weekIndex, offset }) => (
        <WrapperWeekRow
          key={`week-${weekIndex}`}
          weekIndex={weekIndex}
          offset={offset}
        >
          {children(weekIndex)}
        </WrapperWeekRow>
      )),
    [visibleItems, children],
  );

  // Total scrollable content height (pixels). This value is used by the
  // scroll container to set the inner content area size so the native scrollbar
  // behaves as expected for the virtualized list.
  const totalContentHeight = useMemo<number>(
    () => visibleRange.totalWeeks * rowHeight,
    [visibleRange.totalWeeks, rowHeight],
  );

  // Keep the loaded week range synchronized with the active mode and the
  // computed "today" week. When entering date mode we center the range
  // around today. In other modes we expose a default full-year-ish range.
  //
  // Note: `bufferWeeks` is intentionally omitted from the dependency array
  // because it is stable (memoized) and only changes when `weeksPerScreen`
  // changes — if that is changed we expect a re-render at the call site.
  useEffect(() => {
    if (mode === "date" && typeof todayWeekIndex === "number") {
      // Center around "today": the user expects the calendar to focus here.
      setMinWeekIndex(todayWeekIndex - bufferWeeks);
      setMaxWeekIndex(todayWeekIndex + bufferWeeks);
    } else {
      // Default: expose the whole-year range (safe fallback).
      setMinWeekIndex(0);
      setMaxWeekIndex(52);
    }
  }, [mode, todayWeekIndex]);

  // Observe the container's scrollTop via a custom scroll handler hook.
  // This hook attaches a listener and provides a stable, rAF-throttled
  // `scrollTop` value so our virtualization math isn't invoked on every
  // raw scroll event.
  const currentScrollTop = useScrollHandler({ containerRef });

  // Mirror the `currentScrollTop` from the scroll hook into local state.
  // We do this so effects that depend on `scrollTop` can be expressed
  // declaratively and participate in React's lifecycle.
  useEffect(() => {
    setScrollTop(currentScrollTop);
  }, [currentScrollTop]);

  // Run mode-specific side effects (initial scroll + lazy expansion) while
  // preserving hook call order. Passing `enabled` as the third argument
  // lets the hook decide internally whether to run logic for the current
  // mode without us conditionally calling hooks here.
  useModeEffects({
    initialParams: {
      containerRef,
      todayWeekIndex,
      minWeekIndex,
      setScrollTop,
      onDidInitialScroll: () => setDidInitialScroll(true),
    },
    lazyParams: {
      scrollTop,
      viewportHeight,
      minWeekIndex,
      maxWeekIndex,
      setMinWeekIndex,
      setMaxWeekIndex,
      containerRef,
      didInitialScroll,
    },
    enabled: mode === "date",
  });

  return (
    <>
      <VisibleWeeksLabel label={visibleLabel} />
      <InfiniteScrollContainer
        containerRef={containerRef}
        viewportHeight={viewportHeight}
        contentHeight={totalContentHeight}
      >
        {items}
      </InfiniteScrollContainer>
    </>
  );
}
