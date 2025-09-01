import { useCallback, useEffect, useRef, useState } from "react";

import type { ScrollHandlerParams } from "../types/type";

/**
 * useScrollHandler
 *
 * Tiny utility hook that listens for native scroll events on a provided
 * container and exposes a throttled `scrollTop` value. The hook uses the
 * requestAnimationFrame "ticking" pattern to avoid setting state on every
 * scroll event, which can be very frequent and cause unnecessary re-renders.
 *
 * Behavior (step-by-step):
 * 1. Attach a passive `scroll` event listener to the container DOM node.
 * 2. On scroll, if we are not already scheduled (ticking === false), schedule
 *    a requestAnimationFrame callback.
 * 3. In the rAF callback, read `node.scrollTop` and set it into state.
 * 4. Reset the ticking flag so the next scroll can schedule another rAF.
 * 5. Clean up the listener on unmount or when `containerRef` changes.
 *
 * Why rAF/ticking?
 * - Scroll events can fire dozens of times per frame; updating React state on
 *   each event can cause many re-renders. Using rAF batches updates to once
 *   per animation frame, which is much cheaper.
 *
 * @param {ScrollHandlerParams} params - Parameters for the scroll handler.
 * @returns {number} The current scrollTop position, updated at most once per animation frame.
 */
export function useScrollHandler({
  containerRef,
}: ScrollHandlerParams): number {
  // Exposed scroll position state (kept simple, updated within rAF)
  const [scrollTop, setScrollTop] = useState(0);

  // ticking: boolean ref used to prevent scheduling more than one rAF per frame
  // - useRef keeps a mutable value that does not trigger re-renders
  const ticking = useRef(false);

  // onScroll: event callback attached to the DOM node. We wrap in useCallback
  // so the same function identity is stable for add/remove event listener.
  const onScroll = useCallback(() => {
    const node = containerRef.current;
    // If no node, nothing to do
    if (!node) return;

    // If not already scheduled, schedule a rAF to read and flush scrollTop
    if (!ticking.current) {
      requestAnimationFrame(() => {
        // Read the DOM value once per frame and update React state
        setScrollTop(node.scrollTop);
        // Allow future scroll events to schedule another rAF
        ticking.current = false;
      });
      // Mark that we've scheduled an update for the current frame
      ticking.current = true;
    }
  }, [containerRef]);

  // Attach the scroll listener once the node is available and cleanup on change
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Use passive listener to tell the browser we won't call preventDefault()
    node.addEventListener("scroll", onScroll, { passive: true });

    // Cleanup: remove the listener when effect dependencies change / unmount
    return () => node.removeEventListener("scroll", onScroll);
  }, [onScroll, containerRef]);

  // Return the latest throttled scrollTop for consumers
  return scrollTop;
}
