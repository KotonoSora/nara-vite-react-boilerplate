import type { Day } from "date-fns";

import type { SupportedLanguage } from "~/lib/i18n/types/common";

import { getDateFNSLocaleByLanguage } from "./get-date-fns-locale-by-language";

/**
 * Determines the index of the first day of the week based on the provided options.
 *
 * @function getWeekStartsOn
 * @param {Object} params - An object containing the following properties:
 * @param {boolean} [params.startOnSunday] - Optional. If `true`, the week starts on Sunday (0). If `false`, the week starts on Monday (1). If `undefined`, the locale's default is used.
 * @param {Locale} params.locale - The locale object, which may specify a default starting day of the week via `options.weekStartsOn`.
 * @returns {Day} The index of the first day of the week: `0` for Sunday, `1` for Monday, or the value specified by the locale.
 */
export function getWeekStartsOnByLanguage({
  startOnSunday,
  language,
}: {
  startOnSunday?: boolean;
  language?: string;
}): Day {
  const locale = getDateFNSLocaleByLanguage(language as SupportedLanguage);

  return startOnSunday === true
    ? 0
    : startOnSunday === false
      ? 1
      : (locale.options?.weekStartsOn ?? 1);
}
