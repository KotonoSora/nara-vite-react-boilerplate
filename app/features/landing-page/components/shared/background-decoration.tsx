import { memo } from "react";

import { cn } from "~/lib/utils";
import type { FloatingElement, BackgroundDecorationProps } from "~/types/features";

const sizeClasses = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-6 h-6",
};

const colorClasses = {
  primary: "bg-primary/20",
  green: "bg-green-500/20",
  yellow: "bg-yellow-500/20",
  purple: "bg-purple-500/20",
};

export const BackgroundDecoration = memo(function BackgroundDecoration({
  elements,
  className,
}: BackgroundDecorationProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
    >
      {elements.map((element) => (
        <div
          key={element.id}
          className={cn(
            "absolute rounded-full animate-bounce",
            sizeClasses[element.size],
            colorClasses[element.color],
          )}
          style={{
            top: element.position.top,
            bottom: element.position.bottom,
            left: element.position.left,
            right: element.position.right,
            animationDelay: `${element.delay}ms`,
          }}
        />
      ))}
    </div>
  );
});

// Predefined configurations for different sections
export const heroDecorationConfig: FloatingElement[] = [
  {
    id: "hero-bg-1",
    size: "md",
    color: "primary",
    position: { top: "5rem", left: "2.5rem" },
    delay: 1000,
  },
  {
    id: "hero-bg-2",
    size: "lg",
    color: "purple",
    position: { top: "8rem", right: "5rem" },
    delay: 1500,
  },
  {
    id: "hero-bg-3",
    size: "sm",
    color: "primary",
    position: { bottom: "5rem", left: "5rem" },
    delay: 2000,
  },
];

export const keyFeaturesDecorationConfig: FloatingElement[] = [
  {
    id: "key-features-bg-1",
    size: "md",
    color: "primary",
    position: { top: "5rem", left: "2.5rem" },
    delay: 1000,
  },
  {
    id: "key-features-bg-2",
    size: "lg",
    color: "green",
    position: { top: "10rem", right: "5rem" },
    delay: 1500,
  },
  {
    id: "key-features-bg-3",
    size: "sm",
    color: "yellow",
    position: { bottom: "5rem", left: "25%" },
    delay: 2000,
  },
  {
    id: "key-features-bg-4",
    size: "md",
    color: "purple",
    position: { bottom: "8rem", right: "2.5rem" },
    delay: 2500,
  },
];
