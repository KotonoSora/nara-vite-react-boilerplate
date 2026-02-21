import { generateMetaTags } from "@kotonosora/seo";
import { lazy } from "react";

import type { Route } from "./+types/($lang).about";

import type { MiddlewareFunction } from "react-router";

import {
  aboutMiddleware,
  aboutMiddlewareContext,
} from "~/features/about/middleware/about-middleware";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

// Lazy load the about page
const AboutPage = lazy(() =>
  import("~/features/about/page").then((module) => ({
    default: module.AboutPage,
  })),
);

export const middleware: MiddlewareFunction[] = [aboutMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const aboutContent = context.get(aboutMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...aboutContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function Page() {
  return <AboutPage />;
}
