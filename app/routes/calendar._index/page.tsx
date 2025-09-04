import { useCallback, useRef } from "react";

import type {
  CalendarActionHandle,
  RegisterActionsFn,
  RenderDayParams,
} from "./types/type";

import { CalendarApp } from "./components/calendar-app";
import { Controls } from "./components/controls";
import { DayContent } from "./components/day-content";
import { PageHeader } from "./components/page-header";
import { TodayButton } from "./components/today-button";
import { WeekdayHeader } from "./components/weekday-header";
import { PageProvider } from "./context/page-provider";

export function ContentCalendarInfinityPage() {
  const renderDay = useCallback(
    ({ day, dayGlobalIndex, isToday }: RenderDayParams) => (
      <DayContent day={day} dayGlobalIndex={dayGlobalIndex} isToday={isToday} />
    ),
    [],
  );
  const calendarRef = useRef<CalendarActionHandle | null>(null);
  const onRegisterActions = useCallback<RegisterActionsFn>((h) => {
    calendarRef.current = h;
  }, []);

  return (
    <PageProvider>
      <div className="h-screen min-h-0 flex flex-col gap-2 p-4">
        <PageHeader />
        <Controls />
        <TodayButton onClick={() => calendarRef.current?.scrollToToday()} />
        <WeekdayHeader />
        <CalendarApp
          onRegisterActions={onRegisterActions}
          renderDay={renderDay}
        />
      </div>
    </PageProvider>
  );
}
