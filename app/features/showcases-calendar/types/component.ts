import type { SupportedLanguage } from "@kotonosora/i18n";
import type { Day } from "date-fns";
import type { RefObject } from "react";
import type { VirtuosoGridHandle } from "react-virtuoso";

export type DayGridsProps = {
  firstDayOfMonth: Date;
  weekStartsOn: Day;
  language: SupportedLanguage;
  virtuosoRef: RefObject<VirtuosoGridHandle | null>;
};

export type ItemContentProps = {
  dayIndex: number;
  start: Date;
  current: Date;
  language: SupportedLanguage;
};

export type MonthNavigationProps = {
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  monthLabel?: string;
  firstDayOfMonth?: Date;
};

export type WeekdayHeadersProps = {
  weekDays: string[];
};
