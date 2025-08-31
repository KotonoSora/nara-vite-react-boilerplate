import { useEffect } from "react";

import type { Dispatch, RefObject, SetStateAction } from "react";

export function useLazyExpansion(
  scrollTop: number,
  rowHeight: number,
  viewportHeight: number,
  weeksPerScreen: number,
  minWeekIndex: number,
  maxWeekIndex: number,
  setMinWeekIndex: Dispatch<SetStateAction<number>>,
  setMaxWeekIndex: Dispatch<SetStateAction<number>>,
  containerRef: RefObject<HTMLDivElement | null>,
  didInitialScroll: boolean,
) {
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
