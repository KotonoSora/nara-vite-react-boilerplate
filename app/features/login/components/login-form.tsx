import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@kotonosora/i18n-react";
import { Alert, AlertDescription } from "@kotonosora/ui/components/ui/alert";
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
  FieldDescription,
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
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Link, useActionData } from "react-router";
import { z } from "zod";

import type { TranslationFunction } from "@kotonosora/i18n-locales";

const createLoginSchema = (t: TranslationFunction) =>
  z.object({
    email: z.email(t("auth.login.validation.emailRequired")),
    password: z.string().min(8, t("auth.login.validation.passwordMinLength")),
  });

export function LoginForm() {
  const actionData = useActionData();
  const { error } = actionData || {};
  const t = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const loginSchema = createLoginSchema(t);

  const form = useForm<z.infer<ReturnType<typeof createLoginSchema>>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {t("auth.login.title")}
        </CardTitle>
        <CardDescription>{t("auth.login.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-email">
                    {t("auth.login.form.email.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-email"
                    aria-invalid={fieldState.invalid}
                    type="email"
                    placeholder={t("auth.login.form.email.placeholder")}
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-password">
                    {t("auth.login.form.password.label")}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-password"
                      aria-invalid={fieldState.invalid}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.login.form.password.placeholder")}
                      autoComplete="current-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                        onClick={toggleShowPassword}
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

                  <FieldDescription>
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      {t("auth.forgotPassword.heading")}
                    </Link>
                  </FieldDescription>
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
              ? t("auth.login.form.submitting")
              : t("auth.login.form.submit")}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {t("auth.login.noAccount")}{" "}
            </span>
            <Link to="/register" className="underline underline-offset-4">
              {t("auth.login.signUpLink")}
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
