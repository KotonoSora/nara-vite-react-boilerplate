import { generateMetaTags } from "@kotonosora/seo";
import { lazy } from "react";

import type { Route } from "./+types/($lang).chart";

import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

// Lazy load the chart page to prevent recharts from being bundled in SSR
const ContentChartPage = lazy(() =>
  import("~/features/chart/page").then((module) => ({
    default: module.ContentChartPage,
  })),
);

export function loader({ context }: Route.LoaderArgs) {
  const pageInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  return { ...pageInformation, ...i18nContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function Page({}: Route.ComponentProps) {
  return <ContentChartPage />;
}
