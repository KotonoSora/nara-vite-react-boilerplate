import { useI18n } from "./use-i18n";

/**
 * Custom hook that provides access to the current language and a function to update it.
 *
 * @returns An object containing the current `language` and a `setLanguage` function to change it.
 *
 * @example
 * const { language, setLanguage } = useLanguage();
 * setLanguage('en');
 */
export function useLanguage() {
  const { language, setLanguage } = useI18n();
  return { language, setLanguage };
}
