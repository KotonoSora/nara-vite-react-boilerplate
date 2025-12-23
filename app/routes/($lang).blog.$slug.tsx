import { isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/($lang).blog.$slug";

import type { MiddlewareFunction } from "react-router";

import { BlogError } from "~/features/blog/components/blog-error";
import { SlugHydrateFallback } from "~/features/blog/components/slug-hydrate-fallback";
import { SlugPage } from "~/features/blog/components/slug-page";
import {
  slugBlogMiddleware,
  slugBlogMiddlewareContext,
} from "~/features/blog/middleware/slug-blog-middleware";
import { generateMetaTags } from "~/features/seo/utils/generate-meta-tags";

export const clientMiddleware: MiddlewareFunction[] = [slugBlogMiddleware];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { content, frontmatter, slug } = context.get(slugBlogMiddlewareContext);
  return { content, frontmatter, slug };
}

clientLoader.hydrate = true as const;

export function meta({ loaderData: data }: Route.MetaArgs) {
  if (!data) {
    return generateMetaTags({
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    });
  }

  return generateMetaTags({
    title: data.frontmatter.title,
    description: data.frontmatter.description || data.frontmatter.title,
  });
}

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

export default function Page({ loaderData }: Route.ComponentProps) {
  return <SlugPage {...loaderData} />;
}
