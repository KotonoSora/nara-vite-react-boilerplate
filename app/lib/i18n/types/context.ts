import type { ReactNode } from "react";

import type { SupportedLanguage } from "./common";
import type { TranslationFunction } from "./translation";

export interface I18nContextValue {
  language: SupportedLanguage;
  t: TranslationFunction;
  setLanguage: (language: SupportedLanguage) => void;
}

export interface I18nProviderProps {
  children: ReactNode;
  initialLanguage: SupportedLanguage;
}
