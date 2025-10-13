import type { InfiniteScrollContainerProps } from "../types/type";

export function InfiniteScrollContainer({
  containerRef,
  viewportHeight,
  contentHeight,
  children,
}: InfiniteScrollContainerProps) {
  return (
    <div
      ref={containerRef}
      data-infinite-scroll-container
      className="relative overflow-y-scroll"
      style={{ height: viewportHeight }}
      aria-label="infinite-scroll-scrollable"
      role="list"
    >
      <div
        className="relative"
        style={{ height: contentHeight }}
        aria-label="infinite-scroll-content-wrapper"
      >
        {children}
      </div>
    </div>
  );
}
