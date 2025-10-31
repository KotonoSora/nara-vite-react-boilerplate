import type { Route } from "./+types/($lang).blog";

import type { MiddlewareFunction } from "react-router";

import { SlugHydrateFallback } from "~/features/blog/components/slug-hydrate-fallback";
import { SlugPage } from "~/features/blog/components/slug-page";
import {
  slugBlogMiddleware,
  slugBlogMiddlewareContext,
} from "~/features/blog/middleware/slug-blog-middleware";

export const clientMiddleware: MiddlewareFunction[] = [slugBlogMiddleware];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { content } = context.get(slugBlogMiddlewareContext);
  return { content };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <SlugHydrateFallback />;
}

export default function Page({}: Route.ComponentProps) {
  return <SlugPage />;
}
