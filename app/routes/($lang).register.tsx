import { data, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/($lang).register";

import { createUserSession, getUserId } from "~/auth.server";
import { PageContext } from "~/features/register/context/page-context";
import { ContentRegisterPage } from "~/features/register/page";
import { detectLanguageAndLoadTranslations } from "~/lib/i18n/loader-utils";
import { createUser, getUserByEmail } from "~/user.server";

export async function loader({ request }: Route.LoaderArgs) {
  // Redirect if already logged in
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/dashboard");
  }

  // Enhanced language detection and translation loading
  const { language, t } = await detectLanguageAndLoadTranslations(request);

  return {
    registerTitle: t("auth.register.title"),
    registerDescription: t("auth.register.description"),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  // Enhanced language detection for error messages
  const { t } = await detectLanguageAndLoadTranslations(request);

  const registerSchema = z
    .object({
      name: z.string().min(2, t("auth.register.validation.nameMinLength")),
      email: z.email(t("auth.register.validation.emailRequired")),
      password: z
        .string()
        .min(6, t("auth.register.validation.passwordMinLength")),
      confirmPassword: z
        .string()
        .min(6, t("auth.register.validation.confirmPasswordRequired")),
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
    return data(
      { error: firstError?.message || t("errors.common.checkInput") },
      { status: 400 },
    );
  }

  const { name, email, password } = result.data;
  const { db } = context;

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(db, email);
    if (existingUser) {
      return data(
        { error: t("auth.register.errors.accountExists") },
        { status: 400 },
      );
    }

    // Create new user
    const newUser = await createUser(db, {
      name,
      email,
      password,
      role: "user",
    });

    return createUserSession(newUser.id, "/dashboard");
  } catch (error) {
    console.error("Registration error:", error);
    return data(
      { error: t("errors.common.somethingWentWrong") },
      { status: 500 },
    );
  }
}

export function meta({ data }: Route.MetaArgs): ReturnType<Route.MetaFunction> {
  if (!data) {
    return [
      { title: "Sign Up - NARA" },
      { name: "description", content: "Create a new NARA account" },
    ];
  }

  return [
    { title: `${(data as any).registerTitle} - NARA` },
    { name: "description", content: (data as any).registerDescription },
  ];
}

export default function Register({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  return (
    <PageContext.Provider value={{ ...actionData }}>
      <ContentRegisterPage />
    </PageContext.Provider>
  );
}
