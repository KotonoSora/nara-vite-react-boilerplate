import type { TimerDisplayProps } from "../types/common";

export function TimerDisplay({ label }: TimerDisplayProps) {
  return (
    <div className="text-7xl font-thin leading-none tracking-widest text-white text-center">
      {label}
    </div>
  );
}
