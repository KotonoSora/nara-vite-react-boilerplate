import { cn } from "@kotonosora/ui/lib/utils";

import type { BackgroundDecorationProps } from "../types/background-decoration";

import { colorClasses, sizeClasses } from "../constants/background-decoration";

export function BackgroundDecoration({
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
            "absolute rounded-full",
            sizeClasses[element.size],
            colorClasses[element.color],
          )}
          style={{
            top: element.position.top,
            bottom: element.position.bottom,
            left: element.position.left,
            right: element.position.right,
          }}
        />
      ))}
    </div>
  );
}
