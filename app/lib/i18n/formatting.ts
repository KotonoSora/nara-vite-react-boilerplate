import type { SupportedLanguage } from "./config";

// Locale mapping for Intl APIs
const LOCALE_MAP: Record<SupportedLanguage, string> = {
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

// Number formatting
export function formatNumber(
  value: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  return new Intl.NumberFormat(locale, options).format(value);
}

// Currency formatting
export function formatCurrency(
  value: number,
  language: SupportedLanguage,
  currency?: string,
): string {
  const locale = LOCALE_MAP[language];
  const currencyCode = currency || CURRENCY_MAP[language];

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

// Percentage formatting
export function formatPercentage(
  value: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

// Date formatting
export function formatDate(
  date: Date | string | number,
  language: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(dateObj);
}

// Time formatting
export function formatTime(
  date: Date | string | number,
  language: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(dateObj);
}

// Relative time formatting
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  language: SupportedLanguage,
  options?: Intl.RelativeTimeFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    ...options,
  }).format(value, unit);
}

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

// Smart relative time calculation
export function getRelativeTimeString(
  date: Date | string | number,
  language: SupportedLanguage,
): string {
  const now = new Date();
  const targetDate =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;
  const diffInSeconds = Math.floor(
    (targetDate.getTime() - now.getTime()) / 1000,
  );

  const absSeconds = Math.abs(diffInSeconds);

  if (absSeconds < 60) {
    return formatRelativeTime(diffInSeconds, "second", language);
  } else if (absSeconds < 3600) {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 60),
      "minute",
      language,
    );
  } else if (absSeconds < 86400) {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 3600),
      "hour",
      language,
    );
  } else if (absSeconds < 2592000) {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 86400),
      "day",
      language,
    );
  } else if (absSeconds < 31536000) {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 2592000),
      "month",
      language,
    );
  } else {
    return formatRelativeTime(
      Math.floor(diffInSeconds / 31536000),
      "year",
      language,
    );
  }
}

// Compact number formatting (1K, 1M, etc.)
export function formatCompactNumber(
  value: number,
  language: SupportedLanguage,
): string {
  const locale = LOCALE_MAP[language];
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

// Timezone-aware formatting
export function formatDateWithTimezone(
  date: Date | string | number,
  language: SupportedLanguage,
  timezone?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale = LOCALE_MAP[language];
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
    timeZoneName: "short",
    ...options,
  }).format(dateObj);
}

// Get user's timezone
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Get locale from language for Intl APIs
export function getLocaleFromLanguage(language: SupportedLanguage): string {
  return LOCALE_MAP[language];
}
