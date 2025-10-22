import type { SupportedLanguage } from "../types/common";

// Locale mapping for Intl APIs
export const LOCALE_MAP: Record<SupportedLanguage, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  zh: "zh-CN",
  hi: "hi-IN",
  ar: "ar-SA",
  vi: "vi-VN",
  ja: "ja-JP",
  th: "th-TH",
} as const;
