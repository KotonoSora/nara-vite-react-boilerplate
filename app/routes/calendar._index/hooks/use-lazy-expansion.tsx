import { useEffect } from "react";

import type { Dispatch, SetStateAction } from "react";

export function useLazyExpansion(
  scrollTop: number,
  rowHeight: number,
  viewportHeight: number,
  weeksPerScreen: number,
  minWeekIndex: number,
  maxWeekIndex: number,
  setMinWeekIndex: Dispatch<SetStateAction<number>>,
  setMaxWeekIndex: Dispatch<SetStateAction<number>>,
) {
  useEffect(() => {
    const BUFFER_WEEKS = Math.max(weeksPerScreen, 1);
    const totalWeeks = maxWeekIndex - minWeekIndex + 1;
    const totalHeight = totalWeeks * rowHeight;
    const topThreshold = BUFFER_WEEKS * rowHeight;
    const bottomThreshold =
      totalHeight - viewportHeight - BUFFER_WEEKS * rowHeight;

    if (scrollTop < topThreshold) {
      setMinWeekIndex((prev) => {
        const next = prev - BUFFER_WEEKS;
        requestAnimationFrame(() => {
          const container = document.querySelector<HTMLDivElement>(
            "[data-infinite-scroll-container]",
          );
          if (container) {
            container.scrollTop =
              container.scrollTop + BUFFER_WEEKS * rowHeight;
          }
        });
        return next;
      });
    } else if (scrollTop > bottomThreshold) {
      setMaxWeekIndex((prev) => prev + BUFFER_WEEKS);
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
  ]);
}
