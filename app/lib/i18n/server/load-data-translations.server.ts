import type { SupportedLanguage } from "@kotonosora/i18n";

export async function loadDataTranslations(language: SupportedLanguage) {
  switch (language) {
    case "en": {
      return (await import(`@kotonosora/i18n`)).englishTranslations;
    }
    case "es": {
      return (await import(`@kotonosora/i18n`)).spanishTranslations;
    }
    case "fr": {
      return (await import(`@kotonosora/i18n`)).frenchTranslations;
    }
    case "zh": {
      return (await import(`@kotonosora/i18n`)).chineseTranslations;
    }
    case "hi": {
      return (await import(`@kotonosora/i18n`)).hindiTranslations;
    }
    case "ar": {
      return (await import(`@kotonosora/i18n`)).arabicTranslations;
    }
    case "vi": {
      return (await import(`@kotonosora/i18n`)).vietnameseTranslations;
    }
    case "ja": {
      return (await import(`@kotonosora/i18n`)).japaneseTranslations;
    }
    case "th": {
      return (await import(`@kotonosora/i18n`)).thaiTranslations;
    }
    default: {
      // Fallback to English if language not supported
      return (await import(`@kotonosora/i18n`)).englishTranslations;
    }
  }
}
