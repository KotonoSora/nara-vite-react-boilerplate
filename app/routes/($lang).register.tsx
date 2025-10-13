import { sql } from "drizzle-orm";
import { z } from "zod";

import type { Route } from "./+types/($lang).register";

import type { MiddlewareFunction } from "react-router";

import * as schema from "~/database/schema";
import {
  pageMiddleware,
  pageMiddlewareContext,
} from "~/features/register/middleware/page-middleware";
import { ContentRegisterPage } from "~/features/register/page";
import { MAX_USERS } from "~/features/shared/constants/limit";
import { authMiddleware } from "~/features/shared/middleware/auth";
import { createTranslationFunction } from "~/lib/i18n/translations";
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
  const pageContent = context.get(pageMiddlewareContext);
  const { language } = pageContent;
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
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Register({}: Route.ComponentProps) {
  return <ContentRegisterPage />;
}
