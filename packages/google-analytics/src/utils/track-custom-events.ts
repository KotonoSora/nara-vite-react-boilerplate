import type { TrackingEvent } from "../types/tracking-event";

/**
 * Tracks custom events using Google Analytics via the `gtag` function.
 *
 * This function sends a "click" event to Google Analytics with the provided event data,
 * if the Google Analytics tracking ID and the `gtag` function are available.
 *
 * @param event - The custom event data to be tracked. Must conform to the `TrackingEvent` type.
 */
export function trackCustomEvents({
  event,
  isProd,
  trackingId,
}: {
  event: TrackingEvent;
  isProd: boolean;
  trackingId: string | undefined;
}) {
  if (!isProd || typeof window.gtag !== "function" || !trackingId || !event) {
    return;
  }

  window.gtag("event", "click", event);
}
