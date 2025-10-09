import type { BackgroundDecorationProps } from "../types/background-decoration";

import { cn } from "~/lib/utils";

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
