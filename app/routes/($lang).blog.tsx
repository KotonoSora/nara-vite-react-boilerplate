import { generateMetaTags } from "@kotonosora/seo";

import type { Route } from "./+types/($lang).blog";

import type { MiddlewareFunction } from "react-router";

import {
  blogMiddleware,
  BlogReactRouterContext,
} from "~/features/blog/middleware/blog-middleware";
import { BlogPage } from "~/features/blog/page";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

import styleUrl from "~/features/blog/style/custom.css?url";

export function links() {
  return [{ rel: "stylesheet", href: styleUrl }];
}

export const middleware: MiddlewareFunction[] = [blogMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const blogContent = context.get(BlogReactRouterContext);
  return { ...generalInformation, ...i18nContent, ...blogContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function Page({}: Route.ComponentProps) {
  return <BlogPage />;
}
