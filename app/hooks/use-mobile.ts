import { useState, useEffect, useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

// Modern approach using useSyncExternalStore for better performance
function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getServerSnapshot() {
  // Default to false on server to avoid hydration mismatch
  return false;
}

export function useIsMobile() {
  // Use the modern useSyncExternalStore hook for better performance and React 18 compatibility
  if (typeof window !== "undefined") {
    try {
      return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    } catch {
      // Fallback to useState approach if useSyncExternalStore fails
    }
  }

  // Fallback approach for older React versions or SSR
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
