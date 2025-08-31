import { useCallback, useEffect, useRef, useState } from "react";

import type { ScrollHandlerParams } from "../types/type";

/**
 * A hook that handles scroll events for a container.
 *
 * @param params - The parameters for the scroll handler.
 * @param params.containerRef - A reference to the scrollable container element.
 * @returns The current scroll position.
 */
export function useScrollHandler({ containerRef }: ScrollHandlerParams) {
  const [scrollTop, setScrollTop] = useState(0);
  const ticking = useRef(false);

  const onScroll = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    if (!ticking.current) {
      requestAnimationFrame(() => {
        setScrollTop(node.scrollTop);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [containerRef]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, [onScroll, containerRef]);

  return scrollTop;
}
