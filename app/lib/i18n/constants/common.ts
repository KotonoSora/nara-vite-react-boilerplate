import type { SupportedLanguage } from "../types/common";

export const DEFAULT_LANGUAGE = "en" as const;

export const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "zh",
  "hi",
  "ar",
  "vi",
  "ja",
  "th",
] as const;

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  zh: "中文",
  hi: "हिन्दी",
  ar: "العربية",
  vi: "Tiếng Việt",
  ja: "日本語",
  th: "ไทย",
} as const;

// RTL (Right-to-Left) languages configuration
export const RTL_LANGUAGES: readonly SupportedLanguage[] = ["ar"] as const;
