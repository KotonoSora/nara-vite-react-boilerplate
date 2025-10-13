import type { WrapperWeekRowProps } from "../types/type";

import { useCalendar } from "../context/calendar-context";

export function WrapperWeekRow({
  weekIndex,
  offset,
  children,
}: WrapperWeekRowProps) {
  const { rowHeight } = useCalendar();

  return (
    <div
      key={`week-${weekIndex}`}
      className="absolute left-0 right-0"
      style={{
        top: offset * rowHeight,
        height: rowHeight,
      }}
    >
      {children}
    </div>
  );
}
