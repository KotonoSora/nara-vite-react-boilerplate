import { useState } from "react";
import { useFetcher } from "react-router";

import type { SupportedLanguage } from "../types/common";
import type { I18nProviderProps } from "../types/context";

import { createTranslationFunction } from "../utils/translations/create-translation-function";
import { I18nContext } from "./context";

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(initialLanguage);
  const fetcher = useFetcher();

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);

    // Update the language preference on the server
    const formData = new FormData();
    formData.append("language", newLanguage);
    fetcher.submit(formData, {
      method: "POST",
      action: "/action/set-language",
    });
  };

  const t = createTranslationFunction(language);

  const value = {
    language,
    t,
    setLanguage,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
