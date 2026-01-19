import { generateMetaTags } from "@kotonosora/seo";

import type { Route } from "./+types/($lang).showcases._index";

import type { MiddlewareFunction } from "react-router";

import {
  showcasesMiddleware,
  ShowcasesMiddlewareContext,
} from "~/features/showcases/middleware/showcases-middleware";
import { ContentShowcasePage } from "~/features/showcases/page";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [showcasesMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const showcasesContent = context.get(ShowcasesMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...showcasesContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function Page({}: Route.ComponentProps) {
  return <ContentShowcasePage />;
}
