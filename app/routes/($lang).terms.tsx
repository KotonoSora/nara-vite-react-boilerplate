import type { Route } from "./+types/($lang).terms";

import type { MiddlewareFunction } from "react-router";

import { generateMetaTags } from "~/features/seo/utils/generate-meta-tags";
import {
  termsMiddleware,
  termsMiddlewareContext,
} from "~/features/terms/middleware/terms-middleware";
import { ContentTermsPage } from "~/features/terms/page";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [termsMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const termsContent = context.get(termsMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...termsContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function TermsPage({}: Route.ComponentProps) {
  return <ContentTermsPage />;
}
