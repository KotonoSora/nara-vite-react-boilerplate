import type { SupportedLanguage } from "~/lib/i18n/types/common";

export type GenerateMetaTagsParams = {
  title?: string;
  description?: string;
  language?: SupportedLanguage;
};

export type GenerateMetaTagsResponse = Array<Record<string, string>>;
