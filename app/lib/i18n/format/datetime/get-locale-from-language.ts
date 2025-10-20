import type { SupportedLanguage } from "../../types/common";

import { LOCALE_MAP } from "../../constants/locale";

// Get locale from language for Intl APIs
export function getLocaleFromLanguage(language: SupportedLanguage): string {
  return LOCALE_MAP[language];
}
