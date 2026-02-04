import type { WeekdayHeadersProps } from "../types/component";

export function WeekdayHeaders({ weekDays }: WeekdayHeadersProps) {
  if (!Array.isArray(weekDays) || weekDays.length === 0) return null;

  return (
    <div className="flex flex-1 shrink-0 flex-row justify-between items-center box-border border-t border-b border-r border-gray-200 dark:border-gray-700">
      {weekDays.map((day) => (
        <div
          key={day}
          className="flex flex-1 shrink-0 justify-center items-center box-border border-l border-gray-200 dark:border-gray-700"
          aria-label={day}
          data-label={day}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
