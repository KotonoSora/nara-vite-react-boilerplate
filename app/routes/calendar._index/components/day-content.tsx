import type { FC } from "react";
import type { DayContentProps } from "../types/type";

export const DayContent: FC<DayContentProps> = ({
  day,
  dayGlobalIndex,
  isToday,
}) => {
  const label = day
    ? `${day.getDate()}`
    : dayGlobalIndex != null
      ? `${dayGlobalIndex + 1}`
      : "";
  if (isToday) {
    return (
      <div className="p-2">
        <div className="p-2 bg-primary text-primary-foreground rounded">
          Today
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-xs text-gray-400">Events</div>
    </div>
  );
};

export default DayContent;
