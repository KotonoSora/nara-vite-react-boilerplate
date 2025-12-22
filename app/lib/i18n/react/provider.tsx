import { useState } from "react";
import { useFetcher } from "react-router";

import type { JSX } from "react";

import type { SupportedLanguage } from "../types/common";
import type { I18nProviderProps } from "../types/context";

import { createTranslationFunction } from "../utils/translations/create-translation-function";
import { I18nReactContext } from "./context";

/**
 * Provides internationalization (i18n) context to its children components.
 *
 * This provider manages the current language state and exposes translation functionality
 * via context. It also synchronizes language preference changes with the server.
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

  return (
    <I18nReactContext.Provider value={value}>
      {children}
    </I18nReactContext.Provider>
  );
}
