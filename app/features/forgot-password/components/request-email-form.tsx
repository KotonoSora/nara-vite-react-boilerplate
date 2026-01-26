import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@kotonosora/i18n-react";
import { Alert, AlertTitle } from "@kotonosora/ui/components/ui/alert";
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
import { AlertCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Form, Link, useActionData } from "react-router";
import { z } from "zod";

import type { TranslationFunction } from "@kotonosora/i18n-locales";

const requestEmailSchema = (t: TranslationFunction) =>
  z.object({
    email: z.email(t("auth.login.validation.emailRequired")),
  });

export function RequestEmailForm() {
  const actionData = useActionData();
  const { error } = actionData || {};
  const t = useTranslation();
  const requestEmailSchemaInstance = requestEmailSchema(t);

  const form = useForm<z.infer<ReturnType<typeof requestEmailSchema>>>({
    resolver: zodResolver(requestEmailSchemaInstance),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {t("auth.forgotPassword.heading")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.forgotPassword.subheading")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <AlertTitle className="text-sm font-medium text-destructive-foreground">
                {error}
              </AlertTitle>
            </Alert>
          )}

          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-email">
                    {t("auth.forgotPassword.emailLabel")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-email"
                    aria-invalid={fieldState.invalid}
                    type="email"
                    placeholder={t("auth.forgotPassword.emailPlaceholder")}
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
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
            {t("auth.forgotPassword.submitButton")}
          </Button>

          <div className="text-center">
            <Button
              asChild
              variant="link"
              className="text-primary hover:text-primary/80"
            >
              <Link to="/login">{t("auth.forgotPassword.backToSignIn")}</Link>
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
