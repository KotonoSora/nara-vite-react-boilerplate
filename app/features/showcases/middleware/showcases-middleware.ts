import type { MiddlewareFunction } from "react-router";

import type { PageInformation } from "../types/type";

import { fetchShowcases } from "~/features/landing-page/utils/fetch-showcases";
import { getBuiltInDemos } from "~/features/landing-page/utils/get-built-in-demos";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

export const { ShowcasesMiddlewareContext } =
  createMiddlewareContext<PageInformation>("ShowcasesMiddlewareContext");

export const showcasesMiddleware: MiddlewareFunction = async (
  { context, request },
  next,
) => {
  const { db } = context;
  const { t } = context.get(I18nReactRouterContext);

  // Parse pagination and filter params from URL search params
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const pageSizeParam = url.searchParams.get("pageSize");
  const sortByParam = url.searchParams.get("sortBy");
  const sortDirParam = url.searchParams.get("sortDir");
  const searchParam = url.searchParams.get("search");
  const tagsParam = url.searchParams.getAll("tags");

  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = Math.max(1, Number(pageSizeParam) || 20);
  const sortBy =
    sortByParam === "name" ||
    sortByParam === "publishedAt" ||
    sortByParam === "createdAt"
      ? sortByParam
      : ("publishedAt" as const);
  const sortDir =
    sortDirParam === "asc" || sortDirParam === "desc"
      ? (sortDirParam as "asc" | "desc")
      : ("desc" as const);

  const showcases = fetchShowcases(db, {
    page,
    pageSize,
    sortBy,
    sortDir,
    search: searchParam || undefined,
    tags: tagsParam.length ? tagsParam : undefined,
    deleted: "false",
    published: "true",
  });

  const contextValue = {
    commercialLink: "",
    showcases,
    builtInDemos: getBuiltInDemos(t),
  };

  context.set(ShowcasesMiddlewareContext, contextValue);

  return await next();
};
