import { ar, enUS, es, fr, hi, ja, th, vi, zhCN } from "date-fns/locale";

import type { Locale } from "date-fns";

export const DATE_FNS_LOCALE_MAP: Record<string, Locale> = {
  en: enUS,
  es,
  fr,
  zh: zhCN,
  hi,
  ar,
  vi,
  ja,
  th,
};
