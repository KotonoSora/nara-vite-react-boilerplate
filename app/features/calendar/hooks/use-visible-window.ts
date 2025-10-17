import type { VisibleWindowParams } from "../types/type";

/**
 * useVisibleWindow
 *
 * Compute the first and last visible week indexes for the viewport without
 * considering any over-scan buffer. This is the minimal visible window used
 * for UI elements like labels or lightweight decisions where pre-rendering
 * is not desired.
 *
 * Contract:
 * - Inputs: minWeekIndex, maxWeekIndex, scrollTop, rowHeight, viewportHeight
 * - Output: { firstWeekIndex, lastWeekIndex } (absolute week indexes)
 * - Side-effects: none (pure calculation)
 *
 * Steps:
 * 1. Compute which row offset is at the top of the viewport by dividing
 *    scrollTop by rowHeight and flooring the result.
 * 2. Compute how many rows fit in the viewport (ceil(viewportHeight / rowHeight)).
 * 3. Convert the start offset into an absolute week index by adding minWeekIndex.
 * 4. Compute the last visible week index by adding visibleCount - 1 to the
 *    firstWeekIndex and clamping to maxWeekIndex.
 *
 * Dependency rationale:
 * - All inputs are included so the value updates when geometry or
 *   the loaded range changes.
 *
 * @param {VisibleWindowParams} params - Parameters for calculating the visible window.
 */
export function useVisibleWindow({
  minWeekIndex,
  maxWeekIndex,
  scrollTop,
  rowHeight,
  viewportHeight,
}: VisibleWindowParams) {
  // 1) Compute the zero-based offset (from minWeekIndex) of the first row
  //    that is at or above the viewport's top. Clamp to >= 0.
  const firstVisibleOffset = Math.max(0, Math.floor(scrollTop / rowHeight));

  // 2) Determine how many rows can be shown inside the viewport. Use
  //    Math.ceil so partially visible rows count as visible.
  const visibleCount = Math.ceil(viewportHeight / rowHeight);

  // 3) Convert the offset back to an absolute week index within the
  //    overall calendar by adding minWeekIndex.
  const firstWeekIndex = minWeekIndex + firstVisibleOffset;

  // 4) Compute last visible index (inclusive) and clamp it to maxWeekIndex
  //    to avoid returning indexes outside the loaded range.
  const lastWeekIndex = Math.min(
    maxWeekIndex,
    firstWeekIndex + visibleCount - 1,
  );

  return { firstWeekIndex, lastWeekIndex };
}
