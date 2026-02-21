import { generateMetaTags } from "@kotonosora/seo";
import { lazy } from "react";

import type { Route } from "./+types/($lang)._index";

import type { MiddlewareFunction } from "react-router";

import {
  landingPageMiddleware,
  LandingPageReactRouterContext,
} from "~/features/landing-page/middleware/landing-page-middleware";
import { i18nMiddleware, I18nReactRouterContext } from "~/middleware/i18n";
import {
  GeneralInformationContext,
  generalInformationMiddleware,
} from "~/middleware/information";

// Lazy load the landing page
const ContentPage = lazy(() =>
  import("~/features/landing-page/page").then((module) => ({
    default: module.ContentPage,
  })),
);

export const middleware: MiddlewareFunction[] = [
  generalInformationMiddleware,
  i18nMiddleware,
  landingPageMiddleware,
];

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
