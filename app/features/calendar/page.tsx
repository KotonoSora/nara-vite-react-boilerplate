import { ChevronLeft, ChevronRight } from "lucide-react";

import type { JSX } from "react";

import { Button } from "~/components/ui/button";
import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import { useLanguage } from "~/lib/i18n/hooks/use-language";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

import { useCurrentMonthNavigation } from "./hooks/use-current-month-navigation";

function MonthNavigation({
  goToToday,
  goToNextMonth,
  goToPrevMonth,
  monthLabel,
  direction,
}: {
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  monthLabel: string;
  direction: "ltr" | "rtl";
}): JSX.Element {
  const t = useTranslation();

  return (
    <div className="flex flex-1 shrink-0 flex-row justify-between items-center p-2 relative">
      <div className="flex flex-row gap-2 items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
          onClick={goToPrevMonth}
          aria-label={t("calendar.common.previousMonth")}
          data-label={t("calendar.common.previousMonth")}
        >
          {direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={goToToday}
          aria-label="Today"
          data-label="Today"
        >
          {t("calendar.common.today")}
        </Button>
      </div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        aria-label={monthLabel}
        data-label={monthLabel}
      >
        {monthLabel}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="cursor-pointer"
        onClick={goToNextMonth}
        aria-label={t("calendar.common.nextMonth")}
        data-label={t("calendar.common.nextMonth")}
      >
        {direction === "rtl" ? <ChevronLeft /> : <ChevronRight />}
      </Button>
    </div>
  );
}

function WeekdayHeaders({ weekDays }: { weekDays: string[] }): JSX.Element {
  return (
    <div className="flex flex-1 shrink-0 flex-row justify-between items-center border-b">
      {weekDays.map((day) => (
        <div
          key={day}
          className="flex flex-1 shrink-0 justify-center items-center border-l first:border-l-0"
          aria-label={day}
          data-label={day}
        >
          {day}
        </div>
      ))}
    </div>
  );
}

export function ContentCalendarInfinityPage(): JSX.Element {
  const { language } = useLanguage();
  const {
    currentDate,
    goToToday,
    goToNextMonth,
    goToPrevMonth,
    weekDays,
    monthLabel,
    weekStartsOn,
    direction,
  } = useCurrentMonthNavigation({ language });

  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      {/* Header navigation */}
      <HeaderNavigation />

      {/* Month navigation */}
      <section className="container mx-auto sticky top-14 z-40 bg-white dark:bg-black">
        <MonthNavigation
          goToToday={goToToday}
          goToNextMonth={goToNextMonth}
          goToPrevMonth={goToPrevMonth}
          monthLabel={monthLabel}
          direction={direction}
        />
      </section>

      {/* Weekday headers */}
      <section className="container mx-auto sticky top-26 z-30 bg-white dark:bg-black">
        <WeekdayHeaders weekDays={weekDays} />
      </section>

      {/* Calendar content */}
      <section className="container mx-auto">
        <div className="h-screen">
          <div>days grid</div>
          <div>{currentDate.toString()}</div>
          <div>{weekStartsOn}</div>
        </div>
      </section>

      {/* Footer section */}
      <FooterSection />
    </main>
  );
}
