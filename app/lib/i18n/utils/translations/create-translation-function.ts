import type { SupportedLanguage } from "../../types/common";
import type { TranslationKey } from "../../types/translations";

import { getTranslation } from "./get-translation";

export function createTranslationFunction(language: SupportedLanguage) {
  return (key: TranslationKey, params?: Record<string, string | number>) =>
    getTranslation(language, key, params);
}
