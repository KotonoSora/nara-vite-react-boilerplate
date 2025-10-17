import type { TodayWeekIndexParams } from "../types/type";

import { weekToIndex } from "../utils/helper-date";

/**
 * useTodayWeekIndex
 *
 * Returns a numeric week index corresponding to the current date when the
 * calendar is operating in `date` mode. In other modes the hook returns
 * `undefined` to indicate that there is no meaningful "today" week index.
 *
 * Contract:
 * - Input: `mode` string (e.g. "date", "week", etc.)
 * - Output: number | undefined
 * - Side-effects: none (pure calculation)
 *
 * Behavior and rationale:
 * - The hook computes the current week index on every call.
 * - When `mode !== "date"` we deliberately return `undefined` so callers
 *   can detect when to fall back to default ranges.
 *
 * Edge cases:
 * - If system time changes between renders, the value will update
 *   accordingly on the next render.
 *
 * Example:
 * const todayIndex = useTodayWeekIndex(mode);
 * if (todayIndex !== undefined) {
 *   // center calendar around today
 * }
 *
 * @param {TodayWeekIndexParams} params - Parameters for calculating the today week index.
 */
export function useTodayWeekIndex({ mode }: TodayWeekIndexParams) {
  // - If not in `date` mode, return undefined immediately.
  // - Otherwise, convert today's Date() to a week index using helper.
  if (mode !== "date") return undefined;
  // weekToIndex: pure helper that maps a Date -> numeric week index
  return weekToIndex(new Date());
}
