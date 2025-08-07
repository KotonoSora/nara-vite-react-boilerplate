import { type FC } from "react";
import { cn } from "~/lib/utils";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: FC<SkipLinkProps> = ({ href, children, className }) => {
  return (
    <a
      href={href}
      className={cn(
        // Base styles
        "absolute left-4 top-4 z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium",
        // Hidden by default, visible on focus
        "translate-y-[-100vh] focus:translate-y-0",
        // Smooth transition
        "transition-transform duration-150 ease-in-out",
        // Focus styles
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      onFocus={(e) => {
        // Ensure the link is visible when focused
        e.currentTarget.style.position = "absolute";
        e.currentTarget.style.zIndex = "1000";
      }}
    >
      {children}
    </a>
  );
};

export const SkipLinks: FC = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
    </div>
  );
};