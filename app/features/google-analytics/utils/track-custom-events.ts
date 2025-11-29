import { trackingId } from "../constants/tracking-id";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type TrackingEvent = {
  event_category: string;
  event_label: string;
  event_action?: string;
  event_value?: string;
};

/**
 * Tracks custom events using Google Analytics via the `gtag` function.
 *
 * This function sends a "click" event to Google Analytics with the provided event data,
 * if the Google Analytics tracking ID and the `gtag` function are available.
 *
 * @param event - The custom event data to be tracked. Must conform to the `TrackingEvent` type.
 */
export function trackCustomEvents(event: TrackingEvent) {
  if (!import.meta.env.PROD || !window.gtag || !trackingId || !event) return;

  window.gtag("event", "click", event);
}
