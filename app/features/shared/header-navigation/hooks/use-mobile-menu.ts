import { useCallback, useEffect, useRef, useState } from "react";

import { MOBILE_NAVIGATION_ID } from "../constants/constants";

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const close = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        close();
      }
    },
    [isOpen, close],
  );

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        isOpen &&
        !target.closest(`#${MOBILE_NAVIGATION_ID}`) &&
        !target.closest(`[aria-controls='${MOBILE_NAVIGATION_ID}']`)
      ) {
        close();
      }
    },
    [isOpen, close],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [handleEscapeKey]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }
  }, [isOpen, handleOutsideClick]);

  return { isOpen, toggle, close, buttonRef };
}
