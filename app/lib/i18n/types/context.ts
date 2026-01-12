import type { SupportedLanguage, TranslationFunction } from "@kotonosora/i18n";
import type { ReactNode } from "react";

export interface I18nReactContextValue {
  language: SupportedLanguage;
  t: TranslationFunction;
  setLanguage: (language: SupportedLanguage) => void;
}

export interface I18nProviderProps {
  children: ReactNode;
  initialLanguage: SupportedLanguage;
}
