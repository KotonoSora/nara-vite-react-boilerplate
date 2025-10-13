import { useMemo } from "react";

import type { VisibleLabelParams } from "../types/type";

import { indexToWeek } from "../utils/helper-date";

/**
 * useVisibleLabel
 *
 * Build a human-friendly label for the visible weeks shown in the
 * virtualized calendar. This hook centralizes the formatting rules so
 * the component code stays small and the logic is testable.
 *
 * Behavior summary:
 * - In `sequence` mode we render simple week numbers relative to minWeekIndex.
 * - In `date`/default modes we convert week indexes to actual start-of-week
 *   dates and produce a readable date range (e.g. "Sep 01 - Sep 07").
 * - If the range spans years (or ends in a different year than the current
 *   year), we include the years explicitly (e.g. "Dec 28, 2024 - Jan 03, 2025").
 *
 * Contract (inputs/outputs):
 * - Inputs: visibleWindow { firstWeekIndex, lastWeekIndex }, totalWeeks, minWeekIndex, mode
 * - Output: formatted string describing the visible range
 * - Notes: pure formatting function memoized with useMemo for performance
 *
 * Dependency rationale:
 * - We include `visibleWindow` because the label obviously changes when
 *   the visible indexes change.
 * - `totalWeeks` is used only in `sequence` mode where we display "of X".
 * - `minWeekIndex` is required to compute relative week numbers.
 * - `mode` selects the formatting strategy.
 *
 * @param {VisibleLabelParams} params - Parameters for calculating the visible label.
 */
export function useVisibleLabel({
  visibleWindow,
  totalWeeks,
  minWeekIndex,
  mode,
}: VisibleLabelParams) {
  return useMemo(() => {
    const { firstWeekIndex, lastWeekIndex } = visibleWindow;

    // --- Sequence mode: show simple week numbers relative to the loaded range
    if (mode === "sequence") {
      // Convert absolute week indexes to 1-based sequence numbers for display
      const firstNumber = firstWeekIndex - minWeekIndex + 1;
      const lastNumber = lastWeekIndex - minWeekIndex + 1;
      return `Week ${firstNumber} - ${lastNumber} of ${totalWeeks}`;
    }

    // --- Date mode (default): convert week indexes to human-readable date ranges
    // Convert the week indexes to start-of-week Date objects
    const start = indexToWeek(firstWeekIndex);
    const endWeekStart = indexToWeek(lastWeekIndex);

    // The visible range should show the inclusive end date, which is 6 days
    // after the week start (assuming weeks are 7 days long starting at start).
    const end = new Date(endWeekStart);
    end.setDate(end.getDate() + 6);

    // For formatting we may need to include years if the range crosses years
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    // Format short month/day strings (locale aware)
    const startStr = start.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
    });
    const endStr = end.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
    });

    // Include years when the range spans different years or when the end year
    // is not the current year to avoid ambiguity.
    if (startYear !== endYear || endYear !== new Date().getFullYear()) {
      return `${startStr}, ${startYear} - ${endStr}, ${endYear}`;
    }

    // Typical case: same year and it's the current year, render without years
    return `${startStr} - ${endStr}`;
  }, [visibleWindow, totalWeeks, minWeekIndex, mode]);
}
