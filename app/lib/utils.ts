import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Polyfill configuration
// Simulated idle time slice duration in milliseconds.
// Used by the requestIdleCallback polyfill to approximate IdleDeadline.timeRemaining().
const POLYFILL_TIME_SLICE = 50;

// Idle callback helpers
export type IdleCallbackHandle =
  | number
  | ReturnType<typeof globalThis.setTimeout>;
export type IdleDeadline = { timeRemaining: () => number; didTimeout: boolean };
export type IdleCallback = (deadline: IdleDeadline) => void;

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
  return globalThis.setTimeout(() => {
    cb({
      timeRemaining: () =>
        Math.max(
          0,
          POLYFILL_TIME_SLICE - (performance.now() % POLYFILL_TIME_SLICE),
        ),
      didTimeout: false,
    });
  }, 1);
}

/** Cancel an idle callback handle produced by scheduleIdleCallback. */
export function cancelIdleCallback(id: IdleCallbackHandle): void {
  const w = globalThis as unknown as {
    cancelIdleCallback?: (id: number) => void;
  };
  if (typeof w.cancelIdleCallback === "function") {
    w.cancelIdleCallback(id as number);
    return;
  }
  globalThis.clearTimeout(id as ReturnType<typeof globalThis.setTimeout>);
}
