import type { VisibleItemsParams } from "../types/type";

/**
 * useVisibleItems
 *
 * Build a compact list of items to render for the virtualized calendar.
 * Each entry contains the absolute `weekIndex` and the `offset` (row index
 * relative to the top of the currently loaded range). The hook is UI-agnostic
 * — it only returns the minimal data required by the renderer.
 *
 * Contract:
 * - Input: `visibleRange` with startOffset/endOffset and `minWeekIndex`.
 * - Output: array of { weekIndex, offset } covering the inclusive
 *   range [startOffset, endOffset].
 * - Behavior: recomputes result when offsets or minWeekIndex change.
 *
 * Steps:
 * 1. Read start/end offsets from visibleRange.
 * 2. Iterate from startOffset to endOffset (inclusive).
 * 3. For each offset compute absolute weekIndex = minWeekIndex + offset.
 * 4. Push the pair into the result list.
 *
 * @param {VisibleItemsParams} params - Parameters for calculating the visible items.
 */
export function useVisibleItems({
  visibleRange,
  minWeekIndex,
}: VisibleItemsParams) {
  // Prepare an array to collect visible items. Using a local array and
  // returning it is faster than mapping over a generated range.
  const list: { weekIndex: number; offset: number }[] = [];

  // Extract start/end offsets for readability
  const startOffset = visibleRange.startOffset;
  const endOffset = visibleRange.endOffset;

  // Iterate inclusive from startOffset to endOffset and compute absolute week index
  for (let offset = startOffset; offset <= endOffset; offset++) {
    // weekIndex is the absolute index within the overall calendar space
    const weekIndex = minWeekIndex + offset;
    // Append the minimal shape the UI needs: absolute index + offset for positioning
    list.push({ weekIndex, offset });
  }

  // Return the constructed list
  return list;
}
