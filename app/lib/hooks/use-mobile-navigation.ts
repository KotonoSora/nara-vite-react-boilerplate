import { useEffect, useState } from "react";

export interface UseMobileNavigationOptions {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  navigationId?: string;
}

export function useMobileNavigation({
  closeOnEscape = true,
  closeOnOutsideClick = true,
  navigationId = "mobile-navigation",
}: UseMobileNavigationOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  // Close mobile menu when pressing Escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, isOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!closeOnOutsideClick || !isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        !target.closest(`#${navigationId}`) &&
        !target.closest(`[aria-controls='${navigationId}']`)
      ) {
        close();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [closeOnOutsideClick, isOpen, navigationId]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}