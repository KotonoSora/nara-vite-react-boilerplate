import { useMemo } from "react";

import type { VisibleRangeParams } from "../types/type";

/**
 * useVisibleRange
 *
 * Compute the visible offsets used by the virtualized renderer. The hook
 * returns the total number of weeks in the current loaded range and the
 * start/end offsets (relative to `minWeekIndex`) that should be rendered.
 *
 * Steps (algorithm):
 * 1. Determine totalWeeks = max(0, maxWeekIndex - minWeekIndex + 1).
 * 2. Compute firstVisibleOffset = floor(scrollTop / rowHeight) clamped to >= 0.
 * 3. Apply over-scan by subtracting `overScan` from the first visible offset
 *    to obtain `startOffset` (clamped to >= 0).
 * 4. Compute how many rows fit in the viewport (ceil(viewportHeight / rowHeight))
 *    and add over-scan on both sides to get `visibleCount`.
 * 5. Compute `endOffset = min(totalWeeks - 1, startOffset + visibleCount - 1)`
 *    to avoid overflowing the available content.
 *
 * Contract:
 * - Inputs: minWeekIndex, maxWeekIndex, scrollTop, rowHeight, viewportHeight, overScan
 * - Output: { totalWeeks, startOffset, endOffset }
 *
 * Dependency rationale:
 * - All input values are included in the dependency array so the memoized
 *   calculation re-runs whenever geometry or range changes.
 *
 * @param {VisibleRangeParams} params - Parameters for calculating the visible range.
 */
export function useVisibleRange({
  minWeekIndex,
  maxWeekIndex,
  scrollTop,
  rowHeight,
  viewportHeight,
  overScan,
}: VisibleRangeParams) {
  return useMemo(() => {
    // 1) Total weeks available in the loaded range (guard non-negative)
    const totalWeeks = Math.max(0, maxWeekIndex - minWeekIndex + 1);

    // 2) Determine which row (offset from minWeekIndex) sits at the top of the
    //    viewport. floor division yields the zero-based row index.
    const firstVisibleOffset = Math.max(0, Math.floor(scrollTop / rowHeight));

    // 3) Move start earlier by overScan rows to pre-render rows just above
    //    the viewport for a smoother scroll experience.
    const startOffset = Math.max(0, firstVisibleOffset - overScan);

    // 4) Compute how many rows fit in the viewport, add overScan on both sides
    //    to decide how many items to render in total.
    const visibleCount = Math.ceil(viewportHeight / rowHeight) + overScan * 2;

    // 5) Compute the end offset, clamped to the last available week index
    //    within the loaded range (totalWeeks - 1 since offsets are zero-based).
    const endOffset = Math.min(totalWeeks - 1, startOffset + visibleCount - 1);

    return { totalWeeks, startOffset, endOffset };
  }, [
    minWeekIndex,
    maxWeekIndex,
    scrollTop,
    rowHeight,
    viewportHeight,
    overScan,
  ]);
}
