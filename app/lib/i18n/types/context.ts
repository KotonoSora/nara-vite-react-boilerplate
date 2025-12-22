import type { ReactNode } from "react";

import type { SupportedLanguage } from "./common";
import type { TranslationFunction } from "./translations";

export interface I18nReactContextValue {
  language: SupportedLanguage;
  t: TranslationFunction;
  setLanguage: (language: SupportedLanguage) => void;
}

export interface I18nProviderProps {
  children: ReactNode;
  initialLanguage: SupportedLanguage;
}
