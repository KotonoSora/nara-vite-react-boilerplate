import { data, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/($lang).login";

import { createUserSession, getUserId } from "~/auth.server";
import { PageContext } from "~/features/login/context/page-context";
import { ContentLoginPage } from "~/features/login/page";
import { detectLanguageAndLoadTranslations } from "~/lib/i18n/loader-utils";
import { authenticateUser } from "~/user.server";

export async function loader({ request }: Route.LoaderArgs) {
  // Redirect if already logged in
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/dashboard");
  }

  // Enhanced language detection and translation loading
  const { language, t } = await detectLanguageAndLoadTranslations(request);

  return {
    loginTitle: t("auth.login.title"),
    loginDescription: t("auth.login.description"),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  // Enhanced language detection for error messages
  const { t } = await detectLanguageAndLoadTranslations(request);

  const loginSchema = z.object({
    email: z.email(t("auth.login.validation.emailRequired")),
    password: z.string().min(6, t("auth.login.validation.passwordMinLength")),
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

  try {
    const user = await authenticateUser(db, email, password);

    if (!user) {
      return data({ error: t("auth.login.errors.invalidCredentials") }, { status: 400 });
    }

    return createUserSession(user.id, "/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return data(
      { error: t("errors.common.somethingWentWrong") },
      { status: 500 },
    );
  }
}

export function meta({ data }: Route.MetaArgs): ReturnType<Route.MetaFunction> {
  if (!data) {
    return [
      { title: "Sign In - NARA" },
      { name: "description", content: "Sign in to your NARA account" },
    ];
  }

  return [
    { title: `${(data as any).loginTitle} - NARA` },
    { name: "description", content: (data as any).loginDescription },
  ];
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={{ ...actionData }}>
      <ContentLoginPage />
    </PageContext.Provider>
  );
}
