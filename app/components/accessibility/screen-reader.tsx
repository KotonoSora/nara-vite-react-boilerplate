import { type FC } from "react";

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const ScreenReaderOnly: FC<ScreenReaderOnlyProps> = ({ 
  children, 
  as: Component = "span" 
}) => {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
};

interface LiveRegionProps {
  children: React.ReactNode;
  priority?: "polite" | "assertive" | "off";
  atomic?: boolean;
  className?: string;
}

export const LiveRegion: FC<LiveRegionProps> = ({ 
  children, 
  priority = "polite", 
  atomic = true,
  className = "sr-only"
}) => {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      className={className}
    >
      {children}
    </div>
  );
};

interface StatusMessageProps {
  message: string;
  priority?: "polite" | "assertive";
  visible?: boolean;
}

export const StatusMessage: FC<StatusMessageProps> = ({ 
  message, 
  priority = "polite", 
  visible = false 
}) => {
  return (
    <LiveRegion 
      priority={priority} 
      className={visible ? "text-sm text-muted-foreground" : "sr-only"}
    >
      {message}
    </LiveRegion>
  );
};

// Utility function to programmatically announce messages to screen readers
export function announceToScreenReader(
  message: string, 
  priority: "polite" | "assertive" = "polite"
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Clean up after announcement
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

// Utility to check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Utility to check if user has high contrast preference
export function prefersHighContrast(): boolean {
  return window.matchMedia("(prefers-contrast: high)").matches;
}