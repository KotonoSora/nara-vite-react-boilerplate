import {
  BlogError,
  getMdxModules,
  SlugHydrateFallback,
  SlugPage,
} from "@kotonosora/blog";
import { isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/($lang).blog.$";

import type { MiddlewareFunction } from "react-router";

import {
  slugBlogMiddleware,
  SlugBlogReactRouterContext,
} from "~/features/blog/middleware/slug-blog-middleware";

export const middleware: MiddlewareFunction[] = [slugBlogMiddleware];
export const clientMiddleware: MiddlewareFunction[] = [slugBlogMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { frontmatter, slug, modulePath, loading } = context.get(
    SlugBlogReactRouterContext,
  );
  // Server doesn't load the MDX content - just metadata
  return { frontmatter, slug, modulePath, loading };
}

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { frontmatter, slug, modulePath, loading } = context.get(
    SlugBlogReactRouterContext,
  );

  // Load MDX content only on client
  let contentComponent: React.ComponentType<any> | undefined;

  if (modulePath) {
    const mdxModules = getMdxModules();

    // Find and load the module
    const loader = mdxModules[modulePath];
    if (loader) {
      try {
        const module = await loader();
        contentComponent = module.default;
      } catch (error) {
        console.error(`Error loading MDX content for slug "${slug}":`, error);
      }
    }
  }

  return { frontmatter, slug, modulePath, contentComponent, loading };
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
