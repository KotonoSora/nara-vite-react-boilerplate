import type { TrackingEvent } from "../types/tracking-event";

import { trackingId } from "../constants/tracking-id";

/**
 * Tracks custom events using Google Analytics via the `gtag` function.
 *
 * This function sends a "click" event to Google Analytics with the provided event data,
 * if the Google Analytics tracking ID and the `gtag` function are available.
 *
 * @param event - The custom event data to be tracked. Must conform to the `TrackingEvent` type.
 */
export function trackCustomEvents(event: TrackingEvent) {
  if (
    !import.meta.env.PROD ||
    typeof window.gtag !== "function" ||
    !trackingId ||
    !event
  ) {
    return;
  }

  window.gtag("event", "click", event);
}
