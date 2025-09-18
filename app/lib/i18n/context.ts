import { createContext, useContext } from "react";

import type { SupportedLanguage } from "./config";
import type { TranslationFunction } from "./types";

export interface I18nContextValue {
  language: SupportedLanguage;
  t: TranslationFunction;
  setLanguage: (language: SupportedLanguage) => void;
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
