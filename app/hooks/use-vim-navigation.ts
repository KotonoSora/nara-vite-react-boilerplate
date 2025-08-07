import { useEffect, useCallback } from "react";
import { useVim } from "./vim-context";

export function useVimNavigation() {
  const { mode, settings, commandInput, setMode, setCommandInput, executeCommand, setNavigating } = useVim();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle vim keys when enabled
    if (!settings.enabled || mode === "disabled") return;

    // Ignore if user is typing in an input field (unless it's command mode)
    const activeElement = document.activeElement;
    const isInInput = activeElement && (
      activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      activeElement.tagName === "SELECT" ||
      activeElement.hasAttribute("contenteditable")
    );

    if (isInInput && mode !== "command") return;

    // Handle different modes
    switch (mode) {
      case "normal":
        handleNormalMode(event);
        break;
      case "command":
        handleCommandMode(event);
        break;
    }
  }, [mode, settings.enabled, commandInput, setMode, setCommandInput, executeCommand]);

  const handleNormalMode = useCallback((event: KeyboardEvent) => {
    setNavigating(true);
    
    switch (event.key.toLowerCase()) {
      case ":":
        event.preventDefault();
        setMode("command");
        setCommandInput("");
        break;
      
      case "j":
        event.preventDefault();
        scrollOrNavigate("down");
        break;
      
      case "k":
        event.preventDefault();
        scrollOrNavigate("up");
        break;
      
      case "h":
        event.preventDefault();
        scrollOrNavigate("left");
        break;
      
      case "l":
        event.preventDefault();
        scrollOrNavigate("right");
        break;
      
      case "g":
        if (event.repeat) break; // Avoid repeated triggers
        // Handle 'gg' - go to top
        const handleSecondG = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === "g") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            document.removeEventListener("keydown", handleSecondG);
          }
          document.removeEventListener("keydown", handleSecondG);
        };
        document.addEventListener("keydown", handleSecondG);
        setTimeout(() => document.removeEventListener("keydown", handleSecondG), 1000);
        break;
      
      case "G":
        event.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        break;
      
      case "escape":
        event.preventDefault();
        // Close any open modals or return to normal state
        const activeDialog = document.querySelector('[role="dialog"][aria-modal="true"]');
        if (activeDialog) {
          const closeButton = activeDialog.querySelector('[aria-label*="close"], [aria-label*="Close"], .close-button');
          if (closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        }
        break;
      
      case "enter":
      case " ":
        // Activate focused element
        const focusedElement = document.activeElement;
        if (focusedElement instanceof HTMLElement && focusedElement.click) {
          event.preventDefault();
          focusedElement.click();
        }
        break;
      
      case "tab":
        // Allow default tab behavior but track navigation
        setNavigating(true);
        break;
    }
    
    // Clear navigation flag after a short delay
    setTimeout(() => setNavigating(false), 100);
  }, [setMode, setCommandInput, setNavigating]);

  const handleCommandMode = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        executeCommand(commandInput);
        break;
      
      case "Escape":
        event.preventDefault();
        setMode("normal");
        setCommandInput("");
        break;
      
      case "Backspace":
        event.preventDefault();
        setCommandInput(prev => prev.slice(0, -1));
        break;
      
      default:
        // Add character to command input
        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          event.preventDefault();
          setCommandInput(prev => prev + event.key);
        }
        break;
    }
  }, [commandInput, executeCommand, setMode, setCommandInput]);

  const scrollOrNavigate = useCallback((direction: "up" | "down" | "left" | "right") => {
    const focusedElement = document.activeElement;
    
    // If we're in a list or menu, try to navigate within it
    if (focusedElement) {
      const listParent = focusedElement.closest('[role="menu"], [role="listbox"], ul, ol, .vim-navigable');
      if (listParent) {
        navigateInList(listParent, direction);
        return;
      }
    }
    
    // Otherwise, scroll the page
    const scrollAmount = 100;
    switch (direction) {
      case "up":
        window.scrollBy({ top: -scrollAmount, behavior: "smooth" });
        break;
      case "down":
        window.scrollBy({ top: scrollAmount, behavior: "smooth" });
        break;
      case "left":
        window.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        break;
      case "right":
        window.scrollBy({ left: scrollAmount, behavior: "smooth" });
        break;
    }
  }, []);

  const navigateInList = useCallback((listElement: Element, direction: "up" | "down" | "left" | "right") => {
    const focusableItems = Array.from(
      listElement.querySelectorAll<HTMLElement>(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => {
      const style = getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    const currentIndex = focusableItems.findIndex(item => item === document.activeElement);
    let nextIndex = currentIndex;

    switch (direction) {
      case "up":
      case "left":
        nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableItems.length - 1;
        break;
      case "down":
      case "right":
        nextIndex = currentIndex < focusableItems.length - 1 ? currentIndex + 1 : 0;
        break;
    }

    if (focusableItems[nextIndex]) {
      focusableItems[nextIndex].focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    isVimEnabled: settings.enabled && mode !== "disabled",
    currentMode: mode,
  };
}