import { generateMetaTags } from "@kotonosora/seo";
import { lazy } from "react";

import type { Route } from "./+types/($lang).terms";

import type { MiddlewareFunction } from "react-router";

import {
  termsMiddleware,
  termsMiddlewareContext,
} from "~/features/terms/middleware/terms-middleware";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

// Lazy load the terms page to prevent @radix-ui/react-scroll-area from being bundled in SSR
const ContentTermsPage = lazy(() =>
  import("~/features/terms/page").then((module) => ({
    default: module.ContentTermsPage,
  })),
);

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
