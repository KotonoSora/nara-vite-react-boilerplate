import type { SupportedLanguage } from "~/types/i18n";

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
export const DEFAULT_LANGUAGE = "en" as const;

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

export function isRTLLanguage(language: SupportedLanguage): boolean {
  return RTL_LANGUAGES.includes(language);
}

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function getLanguageFromPath(
  pathname: string,
): SupportedLanguage | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isSupportedLanguage(firstSegment)) {
    return firstSegment;
  }

  return null;
}

export function removeLanguageFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isSupportedLanguage(firstSegment)) {
    const pathWithoutLang = "/" + segments.slice(1).join("/");
    return pathWithoutLang;
  }

  return pathname;
}

export function addLanguageToPath(
  pathname: string,
  language: SupportedLanguage,
): string {
  const cleanPath = removeLanguageFromPath(pathname);
  if (language === DEFAULT_LANGUAGE) {
    return cleanPath;
  }
  return `/${language}${cleanPath === "/" ? "" : cleanPath}`;
}

export function detectLanguageFromAcceptLanguage(
  acceptLanguage?: string,
): SupportedLanguage {
  if (!acceptLanguage) {
    return DEFAULT_LANGUAGE;
  }

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, quality = "1"] = lang.trim().split(";q=");
      return {
        code: code.split("-")[0].toLowerCase(),
        quality: parseFloat(quality),
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of languages) {
    if (isSupportedLanguage(code)) {
      return code;
    }
  }

  return DEFAULT_LANGUAGE;
}
