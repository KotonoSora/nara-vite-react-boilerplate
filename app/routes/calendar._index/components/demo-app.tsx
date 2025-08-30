import { useCallback, useRef, useState } from "react";

import type { EventsMap } from "../types/type";

import { cn } from "~/lib/utils";

import { CalendarProvider } from "../context/calendar-provider";
import { VirtualCalendar } from "./virtual-calendar";

export function DemoApp({
  weeksPerScreen,
  overScan,
}: {
  weeksPerScreen: number;
  overScan: number;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const [events] = useState<EventsMap>({
    "2025-08-30": [
      { id: "task1", label: "Meeting" },
      { id: "task2", label: "Coding" },
    ],
    "2025-08-31": [{ id: "task3", label: "Workout" }],
  });

  const renderDay = useCallback(
    (d: Date, isToday: boolean) => {
      let dateString: string = d.getDate().toString();

      if (d.getDate() === 1) {
        const needsYear = d.getFullYear() !== new Date().getFullYear();
        const fmt = new Intl.DateTimeFormat(undefined, {
          day: "2-digit",
          month: "2-digit",
          ...(needsYear ? { year: "numeric" } : {}),
        } as Intl.DateTimeFormatOptions);
        dateString = fmt.format(d);
      }

      return (
        <div className={cn("text-sm", { "font-bold": isToday })}>
          {dateString}
        </div>
      );
    },
    [events],
  );

  return (
    <div ref={parentRef} className="flex flex-col flex-1">
      <CalendarProvider
        key={weeksPerScreen}
        weeksPerScreen={weeksPerScreen}
        overScan={overScan}
        renderDay={renderDay}
        parentRef={parentRef}
      >
        <VirtualCalendar />
      </CalendarProvider>
    </div>
  );
}
