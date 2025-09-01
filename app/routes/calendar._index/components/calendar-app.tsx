import { useRef } from "react";

import { CalendarProvider } from "../context/calendar-provider";
import { usePageContext } from "../context/page-context";
import { VirtualCalendar } from "./virtual-calendar";

export function CalendarApp() {
  const parentRef = useRef<HTMLDivElement>(null);
  const { weeksPerScreen, mode } = usePageContext();

  return (
    <div ref={parentRef} className="relative flex flex-col flex-1 min-h-0">
      <CalendarProvider
        key={`calendar-mode-${mode}-weeksPerScreen-${weeksPerScreen}`}
        parentRef={parentRef}
      >
        <VirtualCalendar />
      </CalendarProvider>
    </div>
  );
}
