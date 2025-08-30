import { useRef } from "react";

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

  return (
    <div ref={parentRef} className="flex flex-col flex-1">
      <CalendarProvider
        key={weeksPerScreen}
        weeksPerScreen={weeksPerScreen}
        overScan={overScan}
        parentRef={parentRef}
      >
        <VirtualCalendar />
      </CalendarProvider>
    </div>
  );
}
