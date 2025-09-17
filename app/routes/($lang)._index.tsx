import type { MiddlewareFunction } from "react-router";
import type { Route } from "./+types/($lang)._index";

import { PageContext } from "~/features/landing-page/context/page-context";
import {
  pageMiddleware,
  pageMiddlewareContext,
} from "~/features/landing-page/middleware/page-middleware";
import { ContentPage } from "~/features/landing-page/page";

export const middleware: MiddlewareFunction[] = [pageMiddleware];

export async function loader({ context, request }: Route.LoaderArgs) {
  const pageContent = context.get(pageMiddlewareContext);

  return pageContent;
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !("title" in loaderData) ||
    !("description" in loaderData) ||
    !loaderData.title ||
    !loaderData.description
  ) {
    return [
      {
        title:
          "NARA Website Starter Kit — Modern, Flexible, Type-Safe Boilerplate",
      },
      {
        name: "description",
        content:
          "A fast, opinionated starter template for building full-stack React apps powered by React Router v7, Cloudflare Workers, and modern tooling. Built with a focus on type safety, performance, and developer ergonomics.",
      },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  if (!loaderData || "error" in loaderData) return null;

  const {
    title,
    description,
    githubRepository,
    commercialLink,
    showcases,
    steps,
    featuresConfig,
  } = loaderData;

  return (
    <PageContext.Provider
      value={{
        title,
        description,
        githubRepository,
        commercialLink,
        showcases,
        steps,
        featuresConfig,
      }}
    >
      <ContentPage />
    </PageContext.Provider>
  );
}
