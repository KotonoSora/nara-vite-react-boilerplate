import { useCallback, useState, useEffect } from "react";
import { useFetcher } from "react-router";

import type { SupportedLanguage } from "./config";

import { I18nContext } from "./context";
import { createTranslationFunction, preloadTranslations, areTranslationsLoaded } from "./translations";

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage: SupportedLanguage;
}

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(initialLanguage);
  const [isLoading, setIsLoading] = useState(!areTranslationsLoaded(initialLanguage));
  const fetcher = useFetcher();

  // Preload translations for the current language
  useEffect(() => {
    if (!areTranslationsLoaded(language)) {
      setIsLoading(true);
      preloadTranslations(language).finally(() => {
        setIsLoading(false);
      });
    }
  }, [language]);

  const setLanguage = useCallback(
    async (newLanguage: SupportedLanguage) => {
      // Preload new language translations
      if (!areTranslationsLoaded(newLanguage)) {
        setIsLoading(true);
        await preloadTranslations(newLanguage);
        setIsLoading(false);
      }
      
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

  const value = {
    language,
    t,
    setLanguage,
    isLoading,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
