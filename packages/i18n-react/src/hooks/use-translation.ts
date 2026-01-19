import type { TranslationFunction } from "@kotonosora/i18n-locales";

import { useI18n } from "./use-i18n";

/**
 * Custom hook that provides the translation function `t` from the i18n context.
 *
 * @returns {TranslationFunction} The translation function for localizing strings.
 *
 * @example
 * const t = useTranslation();
 * const greeting = t('hello');
 */
export function useTranslation(): TranslationFunction {
  const { t } = useI18n();
  return t;
}
