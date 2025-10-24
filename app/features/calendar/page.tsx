import { useRef, useState } from "react";

import type {
  CalendarActionHandle,
  RegisterActionsFn,
  RenderDayParams,
} from "./types/type";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

import { CalendarApp } from "./components/calendar-app";
import { Controls } from "./components/controls";
import { DayContent } from "./components/day-content";
import { PageHeader } from "./components/page-header";
import { TodayButton } from "./components/today-button";
import { VisibleWeeksLabel } from "./components/visible-weeks-label";
import { WeekdayHeader } from "./components/weekday-header";
import { usePageContext } from "./context/page-context";
import { PageProvider } from "./context/page-provider";

export function ContentCalendarInfinityPage() {
  const renderDay = ({ day, dayGlobalIndex, isToday }: RenderDayParams) => (
    <DayContent day={day} dayGlobalIndex={dayGlobalIndex} isToday={isToday} />
  );

  const calendarRef = useRef<CalendarActionHandle | null>(null);
  const onRegisterActions: RegisterActionsFn = (h) => {
    calendarRef.current = h;
  };

  const [visibleLabel, setVisibleLabel] = useState<string>("");
  const handleVisibleLabelChange = (l: string) => {
    setVisibleLabel(l);
  };

  function TodayButtonWrapper() {
    const { mode } = usePageContext();
    return mode === "date" ? (
      <TodayButton onClick={() => calendarRef.current?.scrollToToday()} />
    ) : null;
  }

  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      <HeaderNavigation />

      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-4">
        <PageProvider>
          <div className="space-y-4 min-h-screen flex flex-col flex-1 items-stretch justify-start">
            <PageHeader />
            <Controls />
            <TodayButtonWrapper />
            <VisibleWeeksLabel label={visibleLabel} />
            <WeekdayHeader />
            <CalendarApp
              onRegisterActions={onRegisterActions}
              onVisibleLabelChange={handleVisibleLabelChange}
              renderDay={renderDay}
            />
          </div>
        </PageProvider>
      </section>

      <FooterSection />
    </main>
  );
}
