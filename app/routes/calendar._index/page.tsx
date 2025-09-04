import { useCallback, useRef, useState } from "react";

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
import { VisibleWeeksLabel } from "./components/visible-weeks-label";
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
  const [visibleLabel, setVisibleLabel] = useState<string>("");
  const handleVisibleLabelChange = useCallback((l: string) => {
    setVisibleLabel(l);
  }, []);

  return (
    <PageProvider>
      <div className="h-screen min-h-0 flex flex-col gap-2 p-4">
        <PageHeader />
        <Controls />
        <TodayButton onClick={() => calendarRef.current?.scrollToToday()} />
        <VisibleWeeksLabel label={visibleLabel} />
        <WeekdayHeader />
        <CalendarApp
          onRegisterActions={onRegisterActions}
          onVisibleLabelChange={handleVisibleLabelChange}
          renderDay={renderDay}
        />
      </div>
    </PageProvider>
  );
}
