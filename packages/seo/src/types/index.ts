import type { SupportedLanguage } from "@kotonosora/i18n-types";

export type GenerateMetaTagsParams = {
  title?: string;
  description?: string;
  language?: SupportedLanguage;
};

export type GenerateMetaTagsResponse = Array<Record<string, string>>;
