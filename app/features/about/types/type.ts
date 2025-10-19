import type { SupportedLanguage } from "~/lib/i18n/types/common";

export type AboutPageContextType = {
  title: string;
  description: string;
  language: SupportedLanguage;
  content: {
    heading: string;
    tagline: string;
    taglineSecond: string;
    description: string;
    descriptionSecond: string;
    contactLabel: string;
    email: string;
  };
};
