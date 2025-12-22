import type { MiddlewareFunction } from "react-router";

import type { CalendarPageContextType } from "../types/page";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

export const { calendarMiddlewareContext } =
  createMiddlewareContext<CalendarPageContextType>("calendarMiddlewareContext");

export const calendarMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  const { t } = context.get(I18nReactRouterContext);

  const contextValue: CalendarPageContextType = {
    title: t("calendar.meta.title"),
    description: t("calendar.meta.description"),
  };

  context.set(calendarMiddlewareContext, contextValue);

  return await next();
};
