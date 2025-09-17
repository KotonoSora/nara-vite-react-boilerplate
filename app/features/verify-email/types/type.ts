import type { SupportedLanguage } from "~/lib/i18n";

export type VerifyEmailPageProps = {
  isSuccess?: boolean;
  error?: string | null;
  message?: string | null;
};

export type PageInformation = {
  title?: string;
  description?: string;
  language: SupportedLanguage;
};
