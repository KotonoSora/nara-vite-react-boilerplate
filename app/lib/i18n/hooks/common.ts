import { useContext } from "react";

import type { I18nContextValue } from "../types/context";

import { I18nContext } from "../react/context";

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
