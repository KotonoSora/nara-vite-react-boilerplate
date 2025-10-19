import type { SupportedLanguage } from "~/lib/i18n/types/common";

export type RegisterContentProps = {};

export interface RegisterPageInformation {
  title: string;
  description: string;
  language: SupportedLanguage;
}
