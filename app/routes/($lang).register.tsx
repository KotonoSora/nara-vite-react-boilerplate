import { sql } from "drizzle-orm";
import { redirect } from "react-router";
import { z } from "zod";

import type { SupportedLanguage } from "~/lib/i18n";
import type { Route } from "./+types/($lang).register";

import * as schema from "~/database/schema";
import { PageContext } from "~/features/register/context/page-context";
import { ContentRegisterPage } from "~/features/register/page";
import { MAX_USERS } from "~/features/shared/constants/limit";
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
    registerTitle: t("auth.register.title"),
    registerDescription: t("auth.register.description"),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { resolveRequestLanguage } = await import(
    "~/lib/i18n/request-language.server"
  );

  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const formData = await request.formData();

  const registerSchema = z
    .object({
      name: z.string().min(2, t("auth.register.validation.nameMinLength")),
      email: z.email(t("auth.register.validation.emailRequired")),
      password: z
        .string()
        .min(8, t("auth.register.validation.passwordMinLength")),
      confirmPassword: z
        .string()
        .min(8, t("auth.register.validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.register.validation.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

  const result = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    const firstError = result.error.issues[0];
    return { error: firstError?.message || t("errors.common.checkInput") };
  }

  const { name, email, password } = result.data;
  const { db } = context;
  const { user } = schema;

  const userCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .get();

  if (typeof MAX_USERS === "number" && (userCount?.count ?? 0) >= MAX_USERS) {
    return { error: "Registration limit reached" };
  }

  const { getUserByEmail } = await import("~/lib/auth/user.server");

  // Check if user already exists
  const existingUser = await getUserByEmail(db, email);
  if (existingUser) {
    return { error: t("auth.register.errors.accountExists") };
  }

  const { createUser } = await import("~/lib/auth/user.server");

  // Create new user
  const newUser = await createUser(db, {
    name,
    email,
    password,
    role: "user",
  });

  const { createUserSession } = await import("~/lib/auth/auth.server");

  return createUserSession(newUser.id, "/dashboard");
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !("title" in loaderData) ||
    !("description" in loaderData) ||
    !loaderData.title ||
    !loaderData.description
  ) {
    return [
      { title: "Sign Up" },
      { name: "description", content: "Create a new account" },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function Register({ actionData }: Route.ComponentProps) {
  return (
    <PageContext.Provider value={{ error: actionData?.error }}>
      <ContentRegisterPage />
    </PageContext.Provider>
  );
}
