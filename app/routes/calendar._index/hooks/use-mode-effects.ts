import type { ModeEffectsParams } from "../types/type";

import { useInitialScroll } from "./use-initial-scroll";
import { useLazyExpansion } from "./use-lazy-expansion";

/**
 * useModeEffects
 *
 * A small coordinating hook that invokes calendar-related side-effect hooks
 * in a mode-safe, predictable way. The purpose is to avoid conditional hook
 * calls inside components (which would violate the Rules of Hooks). Instead,
 * this hook always calls the underlying hooks but toggles their internal
 * behavior via parameters.
 *
 * Responsibilities:
 * - Trigger the initial scroll effect (optionally enabled/disabled).
 * - Trigger lazy expansion which grows the loaded week range as the user
 *   scrolls near the edges.
 *
 * Contract (inputs/outputs):
 * - initialParams: configuration for initial scroll (refs, callbacks, indexes)
 * - lazyParams: runtime values used by lazy expansion (scrollTop, viewport, setters)
 * - enabled: when false, initial scroll will be a no-op; lazy expansion still
 *   receives its params but will internally guard on didInitialScroll.
 *
 * Important note: both hooks are invoked unconditionally so their internal
 * implementations must themselves return early when disabled. This keeps
 * call order stable across renders.
 *
 * @param {ModeEffectsParams} params - Parameters for configuring mode effects.
 */
export function useModeEffects({
  initialParams,
  lazyParams,
  enabled,
}: ModeEffectsParams) {
  // Pass `enabled` into useInitialScroll so it can decide whether to run.
  // This prevents conditional hook usage in components while still allowing
  // the initial scroll behavior to be toggled by the caller.
  useInitialScroll({ ...initialParams, enabled });

  // Call lazy expansion hook. It will check its own `didInitialScroll`
  // flag (provided via its params) and return early until the initial
  // programmatic scroll completes. Keeping the call unconditional keeps
  // hook order stable.
  useLazyExpansion(lazyParams);

  // No return value: this hook exists purely to orchestrate effects.
}
