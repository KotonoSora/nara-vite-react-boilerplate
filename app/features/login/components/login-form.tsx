import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Link } from "react-router";
import { z } from "zod";

import type { TranslationKey } from "~/lib/i18n/types";

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
import { useI18n } from "~/lib/i18n";

const createLoginSchema = (
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
) =>
  z.object({
    email: z.email(t("auth.login.validation.emailRequired")),
    password: z.string().min(6, t("auth.login.validation.passwordMinLength")),
  });

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

interface LoginFormProps {
  error?: string;
  isSubmitting?: boolean;
}

export function LoginForm({ error, isSubmitting = false }: LoginFormProps) {
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = createLoginSchema(t);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
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
                  <FormLabel>{t("auth.login.form.password.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.login.form.password.placeholder")}
                        autoComplete="current-password"
                        {...field}
                      />
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
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
