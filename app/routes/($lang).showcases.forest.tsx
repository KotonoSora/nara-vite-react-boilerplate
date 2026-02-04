import { BACKGROUND_COLOR, ForestPage } from "@kotonosora/forest";
import customStyleUrl from "@kotonosora/forest/styles/custom?url";
import { generateMetaTags } from "@kotonosora/seo";

import type { Route } from "./+types/($lang).showcases.forest";

import type { MiddlewareFunction } from "react-router";

import {
  forestMiddleware,
  forestMiddlewareContext,
} from "~/features/showcases-forest/middleware/forest-middleware";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export function links() {
  return [{ rel: "stylesheet", href: customStyleUrl }];
}

export const middleware: MiddlewareFunction[] = [forestMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const forestContent = context.get(forestMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...forestContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return [
    ...generateMetaTags({ title, description, language }),
    { name: "theme-color", content: BACKGROUND_COLOR },
  ];
}

export default function Page({}: Route.ComponentProps) {
  return (
    <ForestPage
      isProd={import.meta.env.PROD}
      trackingId={import.meta.env.VITE_GOOGLE_ANALYTICS_TRACKING_ID}
    />
  );
}
