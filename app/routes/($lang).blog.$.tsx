import { BlogError, SlugHydrateFallback, SlugPage } from "@kotonosora/blog";
import { isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/($lang).blog.$";

import type { MiddlewareFunction } from "react-router";

import {
  slugBlogMiddleware,
  SlugBlogReactRouterContext,
} from "~/features/blog/middleware/slug-blog-middleware";

export const clientMiddleware: MiddlewareFunction[] = [slugBlogMiddleware];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { content, frontmatter, slug } = context.get(
    SlugBlogReactRouterContext,
  );
  return { content, frontmatter, slug };
}

clientLoader.hydrate = true as const;

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <BlogError
        error={{
          status: error.status,
          statusText: error.statusText,
          message: error.data?.error || error.statusText,
        }}
      />
    );
  }

  return (
    <BlogError
      error={{
        status: 500,
        message: error instanceof Error ? error.message : "Unknown error",
      }}
    />
  );
}

export function HydrateFallback() {
  return <SlugHydrateFallback />;
}

export default function Page({}: Route.ComponentProps) {
  return <SlugPage />;
}
