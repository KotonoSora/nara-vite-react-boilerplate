import { useTranslation } from "@kotonosora/i18n-react";
import { Button } from "@kotonosora/ui/components/ui/button";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { MonthNavigationProps } from "../types/component";

export function MonthNavigation({
  goToToday,
  goToNextMonth,
  goToPrevMonth,
  monthLabel,
  firstDayOfMonth,
}: MonthNavigationProps) {
  if (!firstDayOfMonth || !monthLabel) return null;

  const dataDate = format(firstDayOfMonth, "yyyy-MM");
  const t = useTranslation();

  return (
    <div className="flex flex-1 shrink-0 flex-row justify-between items-center py-2 relative">
      <div className="flex flex-row gap-2 items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
          onClick={goToPrevMonth}
          aria-label={t("calendar.common.previousMonth")}
          data-label={t("calendar.common.previousMonth")}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="secondary"
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
        data-label={dataDate}
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
        <ChevronRight />
      </Button>
    </div>
  );
}
