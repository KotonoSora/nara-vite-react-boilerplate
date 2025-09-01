import { useRef } from "react";

import type { CalendarEngineMode } from "../types/type";

import { CalendarProvider } from "../context/calendar-provider";
import { VirtualCalendar } from "./virtual-calendar";

export type DemoAppProps = {
  weeksPerScreen: number;
  overScan: number;
  mode: CalendarEngineMode;
};

export function DemoApp({ weeksPerScreen, overScan, mode }: DemoAppProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={parentRef} className="flex flex-col flex-1 min-h-0">
      <CalendarProvider
        key={`calendar-mode-${mode}-weeksPerScreen-${weeksPerScreen}`}
        weeksPerScreen={weeksPerScreen}
        overScan={overScan}
        parentRef={parentRef}
        mode={mode}
      >
        <VirtualCalendar />
      </CalendarProvider>
    </div>
  );
}
