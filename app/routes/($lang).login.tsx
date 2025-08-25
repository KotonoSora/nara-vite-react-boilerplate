import { data, redirect } from "react-router";
import { z } from "zod";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).login";

import { createUserSession, getUserId } from "~/auth.server";
import { PageContext } from "~/features/login/context/page-context";
import { ContentLoginPage } from "~/features/login/page";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";
import { authenticateUser } from "~/user.server";

export async function loader({ request }: Route.LoaderArgs) {
  // Redirect if already logged in
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/dashboard");
  }
  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  return {
    title: t("auth.login.title"),
    description: t("auth.login.description"),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const language: SupportedLanguage = await resolveRequestLanguage(request);
    const t = createTranslationFunction(language);

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
      return data(
        { error: firstError?.message || t("errors.common.checkInput") },
        { status: 400 },
      );
    }

    const { email, password } = result.data;
    const { db } = context;

    const user = await authenticateUser(db, email, password);
    if (!user) {
      return data({ error: t("errors.common.checkInput") }, { status: 400 });
    }

    return createUserSession(user.id, "/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return data(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
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
