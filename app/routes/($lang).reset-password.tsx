import { redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/($lang).reset-password";

import type { MiddlewareFunction } from "react-router";

import {
  pageMiddleware,
  pageMiddlewareContext,
} from "~/features/reset-password/middleware/page-middleware";
import {
  tokenMiddleware,
  tokenMiddlewareContext,
} from "~/features/reset-password/middleware/token";
import { ResetPasswordPage } from "~/features/reset-password/page";
import { isStrongPassword } from "~/lib/auth/config";
import { createTranslationFunction } from "~/lib/i18n/translations";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [
  tokenMiddleware,
  pageMiddleware,
];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const { token } = context.get(tokenMiddlewareContext);
  const { title, description } = context.get(pageMiddlewareContext);

  return {
    ...generalInformation,
    token,
    title,
    description,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { language } = context.get(pageMiddlewareContext);
  const t = createTranslationFunction(language);

  const formData = await request.formData();
  const resetPasswordSchema = z
    .object({
      token: z.string().min(1, t("auth.resetPassword.errorMissingToken")),
      password: z
        .string()
        .min(8, t("auth.resetPassword.errorPasswordTooShort")),
      confirmPassword: z
        .string()
        .min(1, t("auth.resetPassword.errorConfirmPasswordMissing")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.resetPassword.errorPasswordsDoNotMatch"),
      path: ["confirmPassword"],
    });
  const result = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors;
    const fieldErrorMessage = Object.values(errors).flat().join(", ");

    return { error: fieldErrorMessage };
  }
  const { token, password } = result.data;
  // Check password strength
  const passwordCheck = isStrongPassword(password);
  if (!passwordCheck.isValid) {
    return { error: t("auth.resetPassword.errorWeakPassword") };
  }
  const { db } = context;

  const { resetPasswordWithToken } = await import("~/lib/auth/user.server");

  const resetResult = await resetPasswordWithToken(db, token, password);
  if (!resetResult.success) {
    return { error: resetResult.error };
  }

  return redirect("/login?reset=success");
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function ResetPassword({}: Route.ComponentProps) {
  return <ResetPasswordPage />;
}
