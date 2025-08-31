import { useEffect, useRef } from "react";

import type { Dispatch, RefObject, SetStateAction } from "react";

export function useInitialScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  rowHeight: number,
  todayWeekIndex: number,
  minWeekIndex: number,
  setScrollTop: Dispatch<SetStateAction<number>>,
) {
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const node = containerRef.current;
    if (!node) return;

    requestAnimationFrame(() => {
      const initialOffsetWeeks = todayWeekIndex - minWeekIndex + 1;
      const initialTop = initialOffsetWeeks * rowHeight;
      node.scrollTop = initialTop;
      setScrollTop(initialTop);
    });
  }, [containerRef, rowHeight, todayWeekIndex, minWeekIndex, setScrollTop]);
}
