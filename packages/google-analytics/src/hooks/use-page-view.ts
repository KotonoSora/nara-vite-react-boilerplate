import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Custom React hook that sends a Google Analytics page view event
 * whenever the current location changes.
 *
 * This hook uses the `useLocation` hook from `react-router-dom` to
 * detect route changes and triggers the `gtag` page_view event with
 * the updated path and query string.
 */
export function usePageView({
  isProd,
  trackingId,
}: {
  isProd: boolean;
  trackingId: string | undefined;
}) {
  const location = useLocation();

  useEffect(() => {
    if (!isProd || typeof window.gtag !== "function" || !trackingId) {
      return;
    }

    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
    });
  }, [location, isProd, trackingId]);
}
