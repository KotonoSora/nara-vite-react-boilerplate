import { createContext, useContext } from "react";

import type { SupportedLanguage } from "./config";
import type { PluralCategory } from "./pluralization";
import type { TranslationFunction } from "./types";

import {
  formatCurrency,
  formatDate,
  formatList,
  formatNumber,
  formatPercentage,
  formatRelativeTime,
  formatTime,
  getRelativeTimeString,
  getUserTimezone,
} from "./formatting";
import { createPluralFunction } from "./pluralization";

export interface I18nContextValue {
  language: SupportedLanguage;
  t: TranslationFunction;
  setLanguage: (language: SupportedLanguage) => void;
  // Formatting functions
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatDate: (
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatTime: (
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatRelativeTime: (
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ) => string;
  formatPercentage: (
    value: number,
    options?: Intl.NumberFormatOptions,
  ) => string;
  formatList: (items: string[], options?: Intl.ListFormatOptions) => string;
  getRelativeTimeString: (date: Date | string | number) => string;
  // Pluralization function
  plural: (
    key: string,
    count: number,
    customForms?: Partial<Record<PluralCategory, string>> & { other: string },
    includeCount?: boolean,
  ) => string;
  // Timezone
  timezone: string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  const { t } = useI18n();
  return t;
}

export function useLanguage() {
  const { language, setLanguage } = useI18n();
  return { language, setLanguage };
}

export function useFormatting() {
  const {
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    formatRelativeTime,
    formatPercentage,
    formatList,
    getRelativeTimeString,
  } = useI18n();

  return {
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    formatRelativeTime,
    formatPercentage,
    formatList,
    getRelativeTimeString,
  };
}

export function usePluralization() {
  const { plural } = useI18n();
  return plural;
}
