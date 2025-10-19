import type { SupportedLanguage } from "~/lib/i18n/types/common";

export type LoginContentProps = {};

export type PageInformation = {
  title?: string;
  description?: string;
  language: SupportedLanguage;
};
