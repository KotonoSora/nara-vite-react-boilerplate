import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Link } from "react-router";
import { z } from "zod";

import type { TranslationKey } from "~/lib/i18n";

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

import { usePageContext } from "../context/page-context";

const createRegisterSchema = (
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

type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

export function RegisterForm() {
  const { error } = usePageContext();
  const { t } = useI18n();
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
        <FormProvider {...form}>
          <Form method="post" className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.register.form.name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("auth.register.form.name.placeholder")}
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.register.form.email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("auth.register.form.email.placeholder")}
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
                  <FormLabel>
                    {t("auth.register.form.password.label")}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t(
                          "auth.register.form.password.placeholder",
                        )}
                        autoComplete="new-password"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("auth.register.form.confirmPassword.label")}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t(
                          "auth.register.form.confirmPassword.placeholder",
                        )}
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
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
        </FormProvider>
      </CardContent>
    </Card>
  );
}
