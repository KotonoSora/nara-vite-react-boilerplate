import { useEffect, useRef } from "react";

import type { InitialScrollParams } from "../types/type";

import { useCalendar } from "../context/calendar-context";

/**
 * useInitialScroll
 *
 * Scrolls the provided container to an initial position centered (approximately)
 * around the current "today" week. The hook is idempotent and will only run
 * once per component mount (unless `enabled` changes across mounts).
 *
 * Contract (inputs/outputs):
 * - Inputs: containerRef, todayWeekIndex, minWeekIndex, rowHeight, weeksPerScreen
 * - Side-effects: sets container.scrollTop, calls setScrollTop, calls onDidInitialScroll
 * - Error modes: no-op if containerRef is missing or todayWeekIndex is undefined
 *
 * Edge cases handled:
 * - If computed initial offset is negative, clamp to 0.
 * - If the container DOM node is not available yet, do nothing.
 * - Guarded by `enabled` to allow callers to opt-out.
 *
 * Example usage:
 * useInitialScroll({ containerRef, todayWeekIndex: 20, minWeekIndex: 10, setScrollTop, onDidInitialScroll })
 *
 * @param {InitialScrollParams} params - Parameters for initial scroll behavior.
 */
export function useInitialScroll({
  containerRef,
  todayWeekIndex,
  minWeekIndex,
  setScrollTop,
  onDidInitialScroll,
  enabled = true,
}: InitialScrollParams) {
  // ranOnce: ensure the initial scroll logic only runs a single time per mount
  // (useRef is stable across renders and does not cause re-renders).
  const ranOnce = useRef(false);

  // Read shared calendar values used to compute the initial scroll offsets.
  // - rowHeight: pixel height of a single row/week
  // - weeksPerScreen: how many weeks fit on-screen (used to center)
  const { rowHeight, weeksPerScreen } = useCalendar();

  useEffect(() => {
    // Step 1: Respect the `enabled` flag from the caller.
    if (!enabled) return;

    // Step 2: Only run once. If we've already run, bail out early.
    if (ranOnce.current) return;
    ranOnce.current = true;

    // Step 3: Grab the actual DOM node for the scroll container. If it's
    // not available yet (e.g., not mounted), stop here. This prevents
    // attempting to access properties on `null`.
    const node = containerRef.current;
    if (!node) return;

    // Step 4: Ensure we have a valid todayWeekIndex. If the caller hasn't
    // provided it yet, don't attempt to scroll — the hook is a no-op in that case.
    if (todayWeekIndex === undefined || todayWeekIndex === null) return;

    // Step 5: Use requestAnimationFrame to perform the DOM mutation in the
    // next frame. This reduces layout thrashing and helps the browser paint
    // after mounting. The calculation below finds an approximate center offset
    // (half the visible weeks) and clamps negative offsets to zero.
    requestAnimationFrame(() => {
      // centerOffset: how many weeks from the top of the viewport to the
      // centered week (rounded). E.g., if 5 weeks per screen -> centerOffset=2
      const centerOffset = Math.round(weeksPerScreen / 2);

      // Calculate weeks from the top of the content to today's week
      // relative to the provided minWeekIndex, then add centerOffset so the
      // todayWeekIndex is visually centered.
      let initialOffsetWeeks = todayWeekIndex - minWeekIndex + centerOffset;

      // Clamp negative offsets — cannot scroll to a negative position.
      if (initialOffsetWeeks < 0) initialOffsetWeeks = 0;

      // Compute the top pixel value we should scroll to.
      const initialTop = initialOffsetWeeks * rowHeight;

      // Perform the actual scroll on the DOM node and mirror that value
      // into React state via setScrollTop so other effects can respond.
      node.scrollTop = initialTop;
      setScrollTop(initialTop);

      // Notify caller that the initial scroll completed (optional callback).
      if (onDidInitialScroll) onDidInitialScroll();
    });
    // Dependency explanation:
    // - containerRef: the DOM node reference (identity stable, but include for clarity)
    // - todayWeekIndex, minWeekIndex: inputs to compute the offset
    // - setScrollTop, onDidInitialScroll: functions called by the effect
    // - enabled: whether the effect should run
    // - rowHeight, weeksPerScreen: used to compute pixel offsets / center
  }, [
    containerRef,
    todayWeekIndex,
    minWeekIndex,
    setScrollTop,
    onDidInitialScroll,
    enabled,
    rowHeight,
    weeksPerScreen,
  ]);
}
