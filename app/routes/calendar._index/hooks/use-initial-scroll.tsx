import { useEffect, useRef } from "react";

import type { InitialScrollParams } from "../types/type";

/**
 * Scrolls the container to the initial position based on the current week.
 *
 * @param params - The parameters for the initial scroll.
 * @param params.containerRef - The reference to the scrollable container.
 * @param params.rowHeight - The height of each row in pixels.
 * @param params.todayWeekIndex - The week index of today.
 * @param params.minWeekIndex - The minimum week index to display.
 * @param params.setScrollTop - A function to set the scroll position.
 * @param params.weeksPerScreen - The number of weeks to display on the screen.
 * @param params.onDidInitialScroll - A callback function to call when the initial scroll is done.
 */
export function useInitialScroll({
  containerRef,
  rowHeight,
  todayWeekIndex,
  minWeekIndex,
  setScrollTop,
  weeksPerScreen,
  onDidInitialScroll,
  enabled = true,
}: InitialScrollParams) {
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (ranOnce.current) return;
    ranOnce.current = true;

    const node = containerRef.current;
    if (!node) return;
    if (todayWeekIndex === undefined || todayWeekIndex === null) return;
    requestAnimationFrame(() => {
      const centerOffset = Math.round(weeksPerScreen / 2);
      let initialOffsetWeeks = todayWeekIndex - minWeekIndex + centerOffset;
      if (initialOffsetWeeks < 0) initialOffsetWeeks = 0;

      const initialTop = initialOffsetWeeks * rowHeight;
      node.scrollTop = initialTop;
      setScrollTop(initialTop);

      if (onDidInitialScroll) onDidInitialScroll();
    });
  }, [
    containerRef,
    rowHeight,
    todayWeekIndex,
    minWeekIndex,
    setScrollTop,
    onDidInitialScroll,
    weeksPerScreen,
  ]);
}
