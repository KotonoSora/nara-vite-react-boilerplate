import type { WrapperWeekRowProps } from "../types/type";

export function WrapperWeekRow({
  weekIndex,
  offset,
  rowHeight,
  children,
}: WrapperWeekRowProps) {
  return (
    <div
      key={`week-${weekIndex}`}
      style={{
        position: "absolute",
        top: offset * rowHeight,
        left: 0,
        right: 0,
        height: rowHeight,
      }}
    >
      {children}
    </div>
  );
}
