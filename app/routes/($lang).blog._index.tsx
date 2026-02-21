import { BlogError, SlugHydrateFallback } from "@kotonosora/blog";
import { lazy } from "react";
import { isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/($lang).blog._index";

import type { MiddlewareFunction } from "react-router";

import {
  allBlogMiddleware,
  AllBlogReactRouterContext,
} from "~/features/blog/middleware/all-blog-middleware";

// Lazy load HomePage to prevent blog package from being bundled in SSR
const HomePage = lazy(() =>
  import("@kotonosora/blog").then((module) => ({
    default: module.HomePage,
  })),
);

export const clientMiddleware: MiddlewareFunction[] = [allBlogMiddleware];
export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { posts } = context.get(AllBlogReactRouterContext);

  return { posts };
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
  return <HomePage />;
}
