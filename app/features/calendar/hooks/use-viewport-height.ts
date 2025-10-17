import type { ViewportHeightParams } from "../types/type";

/**
 * useViewportHeight
 *
 * Compute the pixel height of the visible viewport used by the calendar
 * virtualization. The result is calculated so callers can depend on it
 * unless the inputs change.
 *
 * Contract:
 * - Inputs: rowHeight (pixels per row), weeksPerScreen (number of rows visible)
 * - Output: numeric viewport height in pixels
 * - Side-effects: none
 *
 * Notes:
 * - We use Math.max(1, weeksPerScreen) to ensure at least one row is counted.
 *
 * Example:
 * const viewportHeight = useViewportHeight(40, 5); // -> 200
 *
 * @param {ViewportHeightParams} params - Parameters for calculating the viewport height.
 */
export function useViewportHeight({
  rowHeight,
  weeksPerScreen,
}: ViewportHeightParams) {
  // Multiply rowHeight by the number of weeks we want visible.
  // Math.max guards against 0 or negative weeksPerScreen values.
  return rowHeight * Math.max(1, weeksPerScreen);
}
