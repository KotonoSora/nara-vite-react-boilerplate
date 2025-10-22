import type { VisibleWeeksLabelProps } from "../types/type";

export function VisibleWeeksLabel({ label }: VisibleWeeksLabelProps) {
  return (
    <div
      className="absolute left-1/2 top-[18px] -translate-x-1/2 z-10 pointer-events-none"
      aria-label="visible-weeks-label"
    >
      <div
        className="bg-card text-card-foreground px-3 py-1 rounded-md text-sm shadow"
        aria-live="polite"
      >
        {label}
      </div>
    </div>
  );
}
