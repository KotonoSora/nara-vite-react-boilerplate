import { useCallback } from "react";

import type { RenderDayParams } from "./types/type";

import { CalendarApp } from "./components/calendar-app";
import { Controls } from "./components/controls";
import { DayContent } from "./components/day-content";
import { PageHeader } from "./components/page-header";
import { WeekdayHeader } from "./components/weekday-header";
import { PageProvider } from "./context/page-provider";

export function ContentCalendarInfinityPage() {
  const renderDay = useCallback(
    ({ day, dayGlobalIndex, isToday }: RenderDayParams) => (
      <DayContent day={day} dayGlobalIndex={dayGlobalIndex} isToday={isToday} />
    ),
    [],
  );

  return (
    <PageProvider>
      <div className="h-screen min-h-0 flex flex-col gap-2 p-4">
        <PageHeader />
        <Controls />
        <WeekdayHeader />
        <CalendarApp renderDay={renderDay} />
      </div>
    </PageProvider>
  );
}
