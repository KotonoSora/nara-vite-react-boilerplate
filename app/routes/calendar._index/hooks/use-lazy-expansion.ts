import { useEffect } from "react";

import type { LazyExpansionParams } from "../types/type";

import { useCalendar } from "../context/calendar-context";

/**
 * useLazyExpansion
 *
 * Expands the range of weeks (min/max) when the user scrolls close to the
 * edges of the currently loaded range. This is a lazy-growth mechanism that
 * keeps the rendered range small until the user approaches the edges.
 *
 * High-level steps:
 * 1. Wait until the initial programmatic scroll has completed (didInitialScroll).
 * 2. Compute how many weeks are visible in the viewport and their start/end
 *    indexes relative to `minWeekIndex`.
 * 3. If the top or bottom gap to the loaded range is smaller than the
 *    configured buffer, expand that side by the required number of weeks.
 * 4. If the top side is expanded, adjust scrollTop to preserve visual
 *    position (so content doesn't jump unexpectedly).
 *
 * Contract (inputs/outputs):
 * - Inputs: scrollTop, viewportHeight, minWeekIndex, maxWeekIndex, containerRef
 * - Outputs: calls setMinWeekIndex and/or setMaxWeekIndex (side-effects)
 * - Error modes: if rowHeight or viewportHeight is <= 0, do nothing
 *
 * @param {LazyExpansionParams} params - Parameters for lazy expansion.
 */
export function useLazyExpansion({
  scrollTop,
  viewportHeight,
  minWeekIndex,
  maxWeekIndex,
  setMinWeekIndex,
  setMaxWeekIndex,
  containerRef,
  didInitialScroll,
}: LazyExpansionParams) {
  // Read shared layout values from calendar context
  const { rowHeight, weeksPerScreen } = useCalendar();

  useEffect(() => {
    // Guard 1: don't run until initial programmatic scroll has happened.
    if (!didInitialScroll) return;

    // Guard 2: ensure we have valid geometry to compute with.
    if (rowHeight <= 0 || viewportHeight <= 0) return;

    // BUFFER_WEEKS: how many weeks we want as a safety margin on each side.
    // Use Math.max to ensure at least 1.
    const BUFFER_WEEKS = Math.max(weeksPerScreen, 1);

    // Compute the visible row offsets (0-based) inside the currently loaded
    // content. We floor the divisions to get integer row indices.
    // visibleStartOffset: number of rows from the top of loaded content that
    // are visible at the current scrollTop.
    const visibleStartOffset = Math.floor(scrollTop / rowHeight);

    // visibleEndOffset: index of the last visible row (inclusive). We subtract
    // 1px to avoid off-by-one when at exact boundaries.
    const visibleEndOffset = Math.floor(
      (scrollTop + viewportHeight - 1) / rowHeight,
    );

    // Convert offsets into absolute week indexes within the overall calendar
    // space by adding minWeekIndex (the top index of the loaded range).
    const visibleStartIndex = minWeekIndex + visibleStartOffset;
    const visibleEndIndex = minWeekIndex + visibleEndOffset;

    // topGap: how many loaded weeks exist above the visible start. If this is
    // less than BUFFER_WEEKS, we should expand upward.
    const topGap = visibleStartIndex - minWeekIndex;

    // bottomGap: how many loaded weeks exist below the visible end. If this is
    // less than BUFFER_WEEKS, we should expand downward.
    const bottomGap = maxWeekIndex - visibleEndIndex;

    // Prepare potential new bounds; start with the current ones.
    let newMin = minWeekIndex;
    let newMax = maxWeekIndex;

    // scrollAdjust: if we expand the top, we want to push the scrollTop down
    // so the user's viewport remains visually stable. This accumulates pixels
    // we should add to scrollTop after expanding.
    let scrollAdjust = 0;

    // Expand upward if needed
    if (topGap < BUFFER_WEEKS) {
      const needUp = BUFFER_WEEKS - topGap; // how many extra weeks to add above
      newMin = minWeekIndex - needUp;
      // If we grow the top, we must shift scroll to keep the same items
      // visible. Move scroll downward by the number of inserted rows.
      scrollAdjust = needUp * rowHeight;
    }

    // Expand downward if needed
    if (bottomGap < BUFFER_WEEKS) {
      const needDown = BUFFER_WEEKS - bottomGap; // how many extra weeks to add below
      newMax = maxWeekIndex + needDown;
    }

    // If bounds changed, apply them and optionally adjust scrollTop
    if (newMin !== minWeekIndex || newMax !== maxWeekIndex) {
      setMinWeekIndex(newMin);
      setMaxWeekIndex(newMax);

      // If we added weeks above, adjust the DOM scrollTop inside a
      // requestAnimationFrame to avoid layout thrashing.
      if (scrollAdjust > 0 && containerRef.current) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop += scrollAdjust;
          }
        });
      }
    }
    // Dependency explanation:
    // - scrollTop, viewportHeight: user-driven positions to recompute visibility
    // - minWeekIndex, maxWeekIndex: current loaded bounds
    // - setMinWeekIndex, setMaxWeekIndex: setters we call when expanding
    // - containerRef: DOM node we may mutate
    // - didInitialScroll: ensures we don't run until initial scroll finished
    // - rowHeight, weeksPerScreen: layout constants used in math
  }, [
    scrollTop,
    viewportHeight,
    minWeekIndex,
    maxWeekIndex,
    setMinWeekIndex,
    setMaxWeekIndex,
    containerRef,
    didInitialScroll,
    rowHeight,
    weeksPerScreen,
  ]);
}
