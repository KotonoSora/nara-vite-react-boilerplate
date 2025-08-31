import { useEffect, useRef } from "react";

import type { Dispatch, RefObject, SetStateAction } from "react";

export function useInitialScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  rowHeight: number,
  todayWeekIndex: number,
  minWeekIndex: number,
  setScrollTop: Dispatch<SetStateAction<number>>,
  weeksPerScreen: number,
  onDidInitialScroll?: () => void,
) {
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const node = containerRef.current;
    if (!node) return;

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
