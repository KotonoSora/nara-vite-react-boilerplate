import type { IdleCallback, IdleCallbackHandle } from "../types/common";

import { POLYFILL_TIME_SLICE } from "../constants/common";

/**
 * Schedule a callback during the browser's idle periods when supported.
 * Falls back to a small timeout-based polyfill that approximates IdleDeadline.
 */
export function scheduleIdleCallback(cb: IdleCallback): IdleCallbackHandle {
  const w = globalThis as unknown as {
    requestIdleCallback?: (cb: IdleCallback) => number;
  };
  if (typeof w.requestIdleCallback === "function") {
    return w.requestIdleCallback(cb);
  }
  // Polyfill: execute soon and provide a best-effort timeRemaining
  const scheduledTime = performance.now();
  return globalThis.setTimeout(() => {
    cb({
      timeRemaining: () =>
        Math.max(0, POLYFILL_TIME_SLICE - (performance.now() - scheduledTime)),
      didTimeout: false,
    });
  }, 1);
}
