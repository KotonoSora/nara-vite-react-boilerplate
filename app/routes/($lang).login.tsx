import type { Route } from "./+types/($lang).login";

import type { MiddlewareFunction } from "react-router";

import {
  pageMiddleware,
  pageMiddlewareContext,
} from "~/features/login/middleware/page-middleware";
import { ContentLoginPage } from "~/features/login/page";
import { authMiddleware } from "~/features/shared/middleware/auth";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [
  authMiddleware,
  pageMiddleware,
];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const pageContent = context.get(pageMiddlewareContext);
  return { ...generalInformation, ...pageContent };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { t } = context.get(I18nReactRouterContext);

  const formData = await request.formData();

  const { z } = await import("zod");

  const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, t("auth.login.validation.passwordMinLength")),
  });

  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const firstError = result.error.issues[0];
    return { error: firstError?.message || t("errors.common.checkInput") };
  }

  const { email, password } = result.data;
  const { db } = context;

  const { authenticateUser } =
    await import("~/lib/authentication/server/user.server");

  const user = await authenticateUser(db, email, password);
  if (!user) {
    return { error: t("errors.common.checkInput") };
  }

  const { createUserSession } =
    await import("~/lib/authentication/server/authenticate.server");

  return createUserSession(user.id, "/dashboard");
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Login({}: Route.ComponentProps) {
  return <ContentLoginPage />;
}
