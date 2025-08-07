import { useEffect, useRef, useCallback } from "react";

interface UseFocusManagementOptions {
  restoreOnUnmount?: boolean;
  trapFocus?: boolean;
}

export function useFocusManagement(options: UseFocusManagementOptions = {}) {
  const { restoreOnUnmount = true, trapFocus = false } = options;
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Store the currently focused element
  const storeFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  }, []);

  // Restore focus to the previously focused element
  const restoreFocus = useCallback(() => {
    if (previousActiveElement.current && document.contains(previousActiveElement.current)) {
      previousActiveElement.current.focus();
    }
  }, []);

  // Focus the first focusable element in the container
  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  // Focus the last focusable element in the container
  const focusLast = useCallback(() => {
    if (!containerRef.current) return;
    
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, []);

  // Focus trap implementation
  useEffect(() => {
    if (!trapFocus || !containerRef.current) return;

    const container = containerRef.current;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [trapFocus]);

  // Restore focus on unmount
  useEffect(() => {
    return () => {
      if (restoreOnUnmount) {
        restoreFocus();
      }
    };
  }, [restoreOnUnmount, restoreFocus]);

  return {
    containerRef,
    storeFocus,
    restoreFocus,
    focusFirst,
    focusLast,
  };
}

// Helper function to get focusable elements
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
    (element) => {
      // Check if element is visible
      const style = getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0
      );
    }
  );
}

// Hook for managing focus announcements to screen readers
export function useFocusAnnouncement() {
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove the announcement after a short delay
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  return { announce };
}