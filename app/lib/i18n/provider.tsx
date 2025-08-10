import { useCallback, useState } from "react";
import { useFetcher } from "react-router";

import type { SupportedLanguage } from "./config";

import { I18nContext } from "./context";
import { createTranslationFunction } from "./translations";
import { 
  formatNumber, 
  formatCurrency, 
  formatDate, 
  formatTime, 
  formatRelativeTime,
  getRelativeTimeString,
  formatPercentage,
  formatList,
  getUserTimezone
} from "./formatting";
import { createPluralFunction } from "./pluralization";

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage: SupportedLanguage;
}

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(initialLanguage);
  const fetcher = useFetcher();

  const setLanguage = useCallback(
    (newLanguage: SupportedLanguage) => {
      setLanguageState(newLanguage);

      // Update the language preference on the server
      const formData = new FormData();
      formData.append("language", newLanguage);
      fetcher.submit(formData, {
        method: "POST",
        action: "/action/set-language",
      });
    },
    [fetcher],
  );

  const t = createTranslationFunction(language);
  const plural = createPluralFunction(language);
  const timezone = getUserTimezone();

  const value = {
    language,
    t,
    setLanguage,
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => formatNumber(value, language, options),
    formatCurrency: (value: number, currency?: string) => formatCurrency(value, language, currency),
    formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => formatDate(date, language, options),
    formatTime: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => formatTime(date, language, options),
    formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions) => formatRelativeTime(value, unit, language, options),
    formatPercentage: (value: number, options?: Intl.NumberFormatOptions) => formatPercentage(value, language, options),
    formatList: (items: string[], options?: Intl.ListFormatOptions) => formatList(items, language, options),
    getRelativeTimeString: (date: Date | string | number) => getRelativeTimeString(date, language),
    plural,
    timezone,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
