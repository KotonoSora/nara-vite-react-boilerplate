import { z } from "zod";

import type { TranslationKey } from "~/lib/i18n/types";

// Auth schemas shared between UI forms and route actions

export const createLoginSchema = (
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
) =>
  z.object({
    email: z.email(t("auth.login.validation.emailRequired")),
    password: z.string().min(6, t("auth.login.validation.passwordMinLength")),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export const createRegisterSchema = (
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
) =>
  z
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

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;
