import type { SupportedLanguage } from "../types/common";

export async function loadDataTranslations(language: SupportedLanguage) {
  switch (language) {
    case "en": {
      return (await import(`../constants/locales/english`)).englishTranslations;
    }
    case "es": {
      return (await import(`../constants/locales/spanish`)).spanishTranslations;
    }
    case "fr": {
      return (await import(`../constants/locales/french`)).frenchTranslations;
    }
    case "zh": {
      return (await import(`../constants/locales/chinese`)).chineseTranslations;
    }
    case "hi": {
      return (await import(`../constants/locales/hindi`)).hindiTranslations;
    }
    case "ar": {
      return (await import(`../constants/locales/arabic`)).arabicTranslations;
    }
    case "vi": {
      return (await import(`../constants/locales/vietnamese`))
        .vietnameseTranslations;
    }
    case "ja": {
      return (await import(`../constants/locales/japanese`))
        .japaneseTranslations;
    }
    case "th": {
      return (await import(`../constants/locales/thai`)).thaiTranslations;
    }
    default: {
      // Fallback to English if language not supported
      return (await import(`../constants/locales/english`)).englishTranslations;
    }
  }
}
