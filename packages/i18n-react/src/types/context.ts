import type { TranslationFunction } from "@kotonosora/i18n";
import type { SupportedLanguage } from "@kotonosora/i18n-locales";
import type { ReactNode } from "react";

export type I18nReactContextValue = {
  language: SupportedLanguage;
  t: TranslationFunction;
  setLanguage: (language: SupportedLanguage) => void;
};

export type I18nProviderProps = {
  children: ReactNode;
  initialLanguage: SupportedLanguage;
};
