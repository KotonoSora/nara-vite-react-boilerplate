import type { SupportedLanguage } from "~/lib/i18n";

export type ResetPasswordPageProps = {
  token: string;
  error?: string;
};

export interface ResetPasswordPageInformation {
  title: string;
  description: string;
  language: SupportedLanguage;
}
