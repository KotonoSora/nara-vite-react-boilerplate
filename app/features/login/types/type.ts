import type { SupportedLanguage } from "~/lib/i18n/config";

export type LoginContentProps = {};

export type PageInformation = {
  title?: string;
  description?: string;
  language: SupportedLanguage;
};
