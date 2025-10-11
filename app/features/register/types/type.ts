import type { SupportedLanguage } from "~/lib/i18n/config";

export type RegisterContentProps = {};

export interface RegisterPageInformation {
  title: string;
  description: string;
  language: SupportedLanguage;
}
