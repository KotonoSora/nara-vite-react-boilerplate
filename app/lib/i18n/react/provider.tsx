import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

import type { JSX } from "react";

import type { SupportedLanguage } from "../types/common";
import type { I18nProviderProps } from "../types/context";

import { createTranslationFunction } from "../utils/translations/create-translation-function";
import { ensureTranslationsLoaded } from "../utils/translations/get-translation";
import { preloadTranslations } from "../utils/translations/load-translations";
import { I18nContext } from "./context";

/**
 * Provides internationalization (i18n) context to its children components.
 *
 * This provider manages the current language state and exposes translation functionality
 * via context. It also synchronizes language preference changes with the server.
 *
 * Translations are loaded dynamically to reduce initial bundle size - only the current
 * language is loaded, not all available languages.
 *
 * @param {I18nProviderProps} props - The props for the provider.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @param {SupportedLanguage} props.initialLanguage - The initial language to be set.
 *
 * @returns {JSX.Element} The context provider wrapping the children.
 *
 * @example
 * ```tsx
 * <I18nProvider initialLanguage="en">
 *   <App />
 * </I18nProvider>
 * ```
 */
export function I18nProvider({
  children,
  initialLanguage,
}: I18nProviderProps): JSX.Element {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(initialLanguage);
  const [isLoaded, setIsLoaded] = useState(false);
  const fetcher = useFetcher();

  // Load translations for the current language
  useEffect(() => {
    let mounted = true;

    ensureTranslationsLoaded(language).then(() => {
      if (mounted) {
        setIsLoaded(true);

        // Preload likely next languages in the background
        // Common language switches: en->es, en->fr
        if (language === "en") {
          preloadTranslations("es");
          preloadTranslations("fr");
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, [language]);

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setIsLoaded(false); // Show loading state while switching
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

  // Show loading state only on initial load to avoid flash
  if (!isLoaded) {
    return (
      <I18nContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </I18nContext.Provider>
    );
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
