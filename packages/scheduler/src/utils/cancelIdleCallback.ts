import type { IdleCallbackHandle } from "../types/common";

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
