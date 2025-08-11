import type { SupportedLanguage } from "~/lib/i18n";
import type { TranslationKey } from "~/lib/i18n/types";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getTranslation } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function getLegalPageLoaderData(
  request: Request,
  env: unknown,
  titleKey: TranslationKey,
  descriptionKey: TranslationKey,
) {
  const language: SupportedLanguage = await resolveRequestLanguage(request);

  const title = getTranslation(language, titleKey);
  const description = getTranslation(language, descriptionKey);

  const { githubRepository } = await getPageInformation({ ...(env as any) });

  return {
    githubRepository,
    meta: {
      title,
      description,
    },
  };
}
