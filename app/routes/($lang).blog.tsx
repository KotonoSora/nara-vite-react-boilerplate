import type { Route } from "./+types/($lang).blog";

import type { MiddlewareFunction } from "react-router";

import {
  blogMiddleware,
  blogMiddlewareContext,
} from "~/features/blog/middleware/blog-middleware";
import { BlogPage } from "~/features/blog/page";
import { GeneralInformationContext } from "~/middleware/information";

import styleUrl from "~/features/blog/style/custom.css?url";

export function links() {
  return [{ rel: "stylesheet", href: styleUrl }];
}

export const middleware: MiddlewareFunction[] = [blogMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const blogContent = context.get(blogMiddlewareContext);
  return { ...generalInformation, ...blogContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({}: Route.ComponentProps) {
  return <BlogPage />;
}
