import { generateMetaTags } from "@kotonosora/seo";

import type { Route } from "./+types/($lang).chart";

import { ContentChartPage } from "~/features/chart/page";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

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
