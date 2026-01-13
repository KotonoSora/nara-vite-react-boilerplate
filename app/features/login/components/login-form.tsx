import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@kotonosora/i18n-react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Link, useActionData } from "react-router";
import { z } from "zod";

import type { TranslationFunction } from "@kotonosora/i18n-locales";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormProvider,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const createLoginSchema = (t: TranslationFunction) =>
  z.object({
    email: z.email(t("auth.login.validation.emailRequired")),
    password: z.string().min(8, t("auth.login.validation.passwordMinLength")),
  });

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginForm() {
  const actionData = useActionData();
  const { error } = actionData || {};
  const t = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = createLoginSchema(t);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {t("auth.login.title")}
        </CardTitle>
        <CardDescription>{t("auth.login.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <Form method="post" className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.login.form.email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("auth.login.form.email.placeholder")}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>{t("auth.login.form.password.label")}</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      {t("auth.forgotPassword.heading")}
                    </Link>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.login.form.password.placeholder")}
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
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
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
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
        </FormProvider>
      </CardContent>
    </Card>
  );
}
