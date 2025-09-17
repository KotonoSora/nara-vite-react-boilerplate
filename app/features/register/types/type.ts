import type { SupportedLanguage } from "~/lib/i18n";

export type RegisterContentProps = {
  error?: string | null;
};

export interface RegisterPageInformation {
  title: string;
  description: string;
  language: SupportedLanguage;
}
