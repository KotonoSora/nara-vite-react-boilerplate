import type { SupportedLanguage } from "@kotonosora/i18n-locales";

export async function loadDataTranslations(language: SupportedLanguage) {
  switch (language) {
    case "en": {
      return (await import(`@kotonosora/i18n-locales`)).englishTranslations;
    }
    case "es": {
      return (await import(`@kotonosora/i18n-locales`)).spanishTranslations;
    }
    case "fr": {
      return (await import(`@kotonosora/i18n-locales`)).frenchTranslations;
    }
    case "zh": {
      return (await import(`@kotonosora/i18n-locales`)).chineseTranslations;
    }
    case "hi": {
      return (await import(`@kotonosora/i18n-locales`)).hindiTranslations;
    }
    case "ar": {
      return (await import(`@kotonosora/i18n-locales`)).arabicTranslations;
    }
    case "vi": {
      return (await import(`@kotonosora/i18n-locales`)).vietnameseTranslations;
    }
    case "ja": {
      return (await import(`@kotonosora/i18n-locales`)).japaneseTranslations;
    }
    case "th": {
      return (await import(`@kotonosora/i18n-locales`)).thaiTranslations;
    }
    default: {
      // Fallback to English if language not supported
      return (await import(`@kotonosora/i18n-locales`)).englishTranslations;
    }
  }
}
