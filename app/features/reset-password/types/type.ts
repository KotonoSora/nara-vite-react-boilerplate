import type { SupportedLanguage } from "~/lib/i18n/types/common";

export type ResetPasswordPageProps = {
  token: string;
};

export interface ResetPasswordPageInformation {
  title: string;
  description: string;
  language: SupportedLanguage;
}
