import { useEffect } from "react";

import type { LazyExpansionParams } from "../types/type";

/**
 * A hook that handles lazy expansion of the calendar view.
 *
 * @param params - The parameters for the lazy expansion.
 * @param params.scrollTop - The current scroll position.
 * @param params.rowHeight - The height of each row in pixels.
 * @param params.viewportHeight - The height of the visible area in pixels.
 * @param params.weeksPerScreen - The number of weeks to display on the screen.
 * @param params.minWeekIndex - The minimum week index to display.
 * @param params.maxWeekIndex - The maximum week index to display.
 * @param params.setMinWeekIndex - A function to set the minimum week index.
 * @param params.setMaxWeekIndex - A function to set the maximum week index.
 * @param params.containerRef - A reference to the scrollable container element.
 * @param params.didInitialScroll - A flag indicating if the initial scroll has occurred.
 */
export function useLazyExpansion({
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
}: LazyExpansionParams) {
  useEffect(() => {
    if (!didInitialScroll) return;
    if (rowHeight <= 0 || viewportHeight <= 0) return;

    const BUFFER_WEEKS = Math.max(weeksPerScreen, 1);

    const visibleStartOffset = Math.floor(scrollTop / rowHeight);
    const visibleEndOffset = Math.floor(
      (scrollTop + viewportHeight - 1) / rowHeight,
    );

    const visibleStartIndex = minWeekIndex + visibleStartOffset;
    const visibleEndIndex = minWeekIndex + visibleEndOffset;

    const topGap = visibleStartIndex - minWeekIndex;
    const bottomGap = maxWeekIndex - visibleEndIndex;

    let newMin = minWeekIndex;
    let newMax = maxWeekIndex;
    let scrollAdjust = 0;

    if (topGap < BUFFER_WEEKS) {
      const needUp = BUFFER_WEEKS - topGap;
      newMin = minWeekIndex - needUp;
      scrollAdjust = needUp * rowHeight;
    }

    if (bottomGap < BUFFER_WEEKS) {
      const needDown = BUFFER_WEEKS - bottomGap;
      newMax = maxWeekIndex + needDown;
    }

    if (newMin !== minWeekIndex || newMax !== maxWeekIndex) {
      setMinWeekIndex(newMin);
      setMaxWeekIndex(newMax);

      if (scrollAdjust > 0 && containerRef.current) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop += scrollAdjust;
          }
        });
      }
    }
  }, [
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
  ]);
}
