import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@kotonosora/i18n-react";
import { Button } from "@kotonosora/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kotonosora/ui/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@kotonosora/ui/components/ui/field";
import { Input } from "@kotonosora/ui/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@kotonosora/ui/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Link, useActionData } from "react-router";
import { z } from "zod";

import type { TranslationFunction } from "@kotonosora/i18n-locales";

const createRegisterSchema = (t: TranslationFunction) =>
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

type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

export function RegisterForm() {
  const actionData = useActionData();
  const { error } = actionData || {};
  const t = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerSchema = createRegisterSchema(t);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {t("auth.register.title")}
        </CardTitle>
        <CardDescription>{t("auth.register.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-new-name">
                    {t("auth.register.form.name.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-new-name"
                    aria-invalid={fieldState.invalid}
                    type="text"
                    placeholder={t("auth.register.form.name.placeholder")}
                    autoComplete="name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-new-email">
                    {t("auth.register.form.email.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-new-email"
                    aria-invalid={fieldState.invalid}
                    type="email"
                    placeholder={t("auth.register.form.email.placeholder")}
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-new-password">
                    {t("auth.register.form.password.label")}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-new-password"
                      aria-invalid={fieldState.invalid}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.register.form.password.placeholder")}
                      autoComplete="new-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-confirm-password">
                    {t("auth.register.form.confirmPassword.label")}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-confirm-password"
                      aria-invalid={fieldState.invalid}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t(
                        "auth.register.form.confirmPassword.placeholder",
                      )}
                      autoComplete="new-password"
                    />

                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting
              ? t("auth.register.form.submitting")
              : t("auth.register.form.submit")}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {t("auth.register.hasAccount")}{" "}
            </span>
            <Link to="/login" className="underline underline-offset-4">
              {t("auth.register.signInLink")}
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
