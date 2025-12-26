import type { Route } from "./+types/($lang).privacy";

import type { MiddlewareFunction } from "react-router";

import {
  privacyMiddleware,
  privacyMiddlewareContext,
} from "~/features/privacy/middleware/page-middleware";
import { ContentPrivacyPage } from "~/features/privacy/page";
import { generateMetaTags } from "~/features/seo/utils/generate-meta-tags";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [privacyMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const privacyContent = context.get(privacyMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...privacyContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function PrivacyPage({ loaderData }: Route.ComponentProps) {
  return <ContentPrivacyPage />;
}
