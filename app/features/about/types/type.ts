import type { SupportedLanguage } from "~/lib/i18n/config";

export type AboutPageContextType = {
  title: string;
  description: string;
  language: SupportedLanguage;
};
