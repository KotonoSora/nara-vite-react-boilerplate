import type { Route } from "./+types/($lang)._index";

import type { MiddlewareFunction } from "react-router";

import {
  landingPageMiddleware,
  LandingPageReactRouterContext,
} from "~/features/landing-page/middleware/landing-page-middleware";
import { ContentPage } from "~/features/landing-page/page";
import { generateMetaTags } from "~/features/seo/utils/generate-meta-tags";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [landingPageMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const pageContent = context.get(LandingPageReactRouterContext);
  return { ...generalInformation, ...i18nContent, ...pageContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function Page({}: Route.ComponentProps) {
  return <ContentPage />;
}
