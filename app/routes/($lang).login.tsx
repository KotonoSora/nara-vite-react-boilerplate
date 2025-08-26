import { redirect } from "react-router";
import { z } from "zod";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).login";

import { PageContext } from "~/features/login/context/page-context";
import { ContentLoginPage } from "~/features/login/page";
import { createTranslationFunction } from "~/lib/i18n";

export async function loader({ context, request }: Route.LoaderArgs) {
  const { getUserId } = await import("~/lib/auth/auth.server");

  // Redirect if already logged in
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/dashboard");
  }

  const { resolveRequestLanguage } = await import(
    "~/lib/i18n/request-language.server"
  );

  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  return {
    title: t("auth.login.title"),
    description: t("auth.login.description"),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { resolveRequestLanguage } = await import(
    "~/lib/i18n/request-language.server"
  );
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const formData = await request.formData();

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

  const { authenticateUser } = await import("~/lib/auth/user.server");

  const user = await authenticateUser(db, email, password);
  if (!user) {
    return { error: t("errors.common.checkInput") };
  }

  const { createUserSession } = await import("~/lib/auth/auth.server");

  return createUserSession(user.id, "/dashboard");
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !("title" in loaderData) ||
    !("description" in loaderData) ||
    !loaderData.title ||
    !loaderData.description
  ) {
    return [
      { title: "Sign In" },
      {
        name: "description",
        content: "Sign in to your account",
      },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={{ error: actionData?.error }}>
      <ContentLoginPage />
    </PageContext.Provider>
  );
}
