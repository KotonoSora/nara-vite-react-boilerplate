import React, { useCallback, useEffect, useRef, useState } from "react";

export function useScrollHandler(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
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
