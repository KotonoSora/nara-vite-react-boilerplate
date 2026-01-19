import { useLanguage } from "@kotonosora/i18n-react";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

import { DayGrids } from "./components/day-grids";
import { MonthNavigation } from "./components/month-navigation";
import { WeekdayHeaders } from "./components/weekday-headers";
import { useCurrentMonthNavigation } from "./hooks/use-current-month-navigation";

export function ContentCalendarInfinityPage() {
  const { language } = useLanguage();
  const {
    firstDayOfMonth,
    goToToday,
    goToNextMonth,
    goToPrevMonth,
    weekDays,
    monthLabel,
    weekStartsOn,
    virtuosoRef,
  } = useCurrentMonthNavigation({ language });

  return (
    <main className="min-h-svh bg-background content-visibility-auto">
      {/* Header navigation */}
      <HeaderNavigation />

      {/* Month navigation */}
      <section className="container mx-auto sticky top-14 z-40 bg-white dark:bg-black">
        <MonthNavigation
          goToToday={goToToday}
          goToNextMonth={goToNextMonth}
          goToPrevMonth={goToPrevMonth}
          monthLabel={monthLabel}
          firstDayOfMonth={firstDayOfMonth}
        />
      </section>

      {/* Weekday headers */}
      <section className="container mx-auto sticky top-26 z-30 bg-white dark:bg-black">
        <WeekdayHeaders weekDays={weekDays} />
      </section>

      {/* Calendar content */}
      <section className="container mx-auto">
        <DayGrids
          firstDayOfMonth={firstDayOfMonth}
          weekStartsOn={weekStartsOn}
          language={language}
          virtuosoRef={virtuosoRef}
        />
      </section>

      {/* Footer section */}
      <FooterSection />
    </main>
  );
}
