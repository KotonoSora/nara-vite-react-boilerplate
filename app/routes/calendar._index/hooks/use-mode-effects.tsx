import type { InitialScrollParams, LazyExpansionParams } from "../types/type";

import { useInitialScroll } from "./use-initial-scroll";
import { useLazyExpansion } from "./use-lazy-expansion";

/**
 * Calls calendar-related effects in a mode-safe way. The hook itself is
 * always called, but the internal effects are enabled/disabled via the
 * passed options to avoid conditional hooks in components.
 *
 * @param initialParams - Parameters for the initial scroll effect.
 * @param lazyParams - Parameters for the lazy expansion effect.
 * @param enabled - Whether the effects are enabled.
 */
export function useModeEffects(
  initialParams: InitialScrollParams,
  lazyParams: LazyExpansionParams,
  enabled: boolean,
) {
  // Always call both hooks, but pass `enabled` to initial scroll so it
  // can be a no-op when disabled.
  useInitialScroll({ ...initialParams, enabled });

  // Lazy expansion should only run when we've done the initial scroll for
  // date mode; we still call the hook but lazy expansion checks its
  // own didInitialScroll flag and will return early otherwise.
  useLazyExpansion(lazyParams);

  // Expose nothing; this is purely effect-based.
}
