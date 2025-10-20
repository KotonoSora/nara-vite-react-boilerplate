import type { SupportedLanguage } from "../../types/common";

import { LOCALE_MAP } from "../../constants/locale";

// List formatting
export function formatList(
  items: string[],
  language: SupportedLanguage,
  options?: Intl.ListFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
    ...options,
  }).format(items);
}
