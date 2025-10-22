import type { SupportedLanguage } from "../types/common";

// Currency mapping for different locales
export const CURRENCY_MAP: Record<SupportedLanguage, string> = {
  en: "USD",
  es: "EUR",
  fr: "EUR",
  zh: "CNY",
  hi: "INR",
  ar: "SAR",
  vi: "VND",
  ja: "JPY",
  th: "THB",
} as const;
