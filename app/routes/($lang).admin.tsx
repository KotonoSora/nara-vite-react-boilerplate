import { generateMetaTags } from "@kotonosora/seo";

import type { Route } from "./+types/($lang).admin";

import type { MiddlewareFunction } from "react-router";

import {
  adminMiddleware,
  adminMiddlewareContext,
} from "~/features/admin/middleware/admin-middleware";
import { ContentAdminPage } from "~/features/admin/page";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [adminMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const adminContent = context.get(adminMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...adminContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  return <ContentAdminPage />;
}
