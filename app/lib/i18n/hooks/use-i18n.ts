import { useContext } from "react";

import type { I18nReactContextValue } from "../types/context";

import { I18nReactContext } from "../react/context";

/**
 * Custom hook to access the i18n context for internationalization.
 *
 * @returns {I18nReactContextValue} The i18n context value containing translation utilities and locale information.
 *
 * @throws {Error} Throws an error if the hook is used outside of an I18nProvider component.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, locale } = useI18n();
 *   return <div>{t('welcome.message')}</div>;
 * }
 * ```
 */
export function useI18n(): I18nReactContextValue {
  const context = useContext(I18nReactContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
