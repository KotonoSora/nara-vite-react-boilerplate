import { useEffect } from "react";
import { useLocation } from "react-router";

import { trackingId } from "../constants/tracking-id";

/**
 * Custom React hook that sends a Google Analytics page view event
 * whenever the current location changes.
 *
 * This hook uses the `useLocation` hook from `react-router-dom` to
 * detect route changes and triggers the `gtag` page_view event with
 * the updated path and query string.
 */
export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    if (
      !import.meta.env.PROD ||
      typeof window.gtag !== "function" ||
      !trackingId
    ) {
      return;
    }

    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
    });
  }, [location]);
}
