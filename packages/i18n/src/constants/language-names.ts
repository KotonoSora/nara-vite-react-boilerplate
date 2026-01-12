import type { SupportedLanguage } from "../types/common";

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
