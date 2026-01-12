import type { SupportedLanguage } from "@kotonosora/i18n";
import type { Day } from "date-fns";
import type { RefObject } from "react";
import type { VirtuosoGridHandle } from "react-virtuoso";

export type CurrentMonthNavigationProps = {
  language: SupportedLanguage;
  initialDate?: Date | string | number | null;
};

export type CurrentMonthNavigationReturn = {
  firstDayOfMonth: Date;
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  weekDays: string[];
  monthLabel: string;
  weekStartsOn: Day;
  direction: "ltr" | "rtl";
  virtuosoRef: RefObject<VirtuosoGridHandle | null>;
};
