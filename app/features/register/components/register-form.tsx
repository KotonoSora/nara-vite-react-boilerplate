import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, Link } from "react-router";

import type { RegisterFormData } from "~/features/auth/validation";

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
import { PasswordInput } from "~/components/ui/password-input";
import { createRegisterSchema } from "~/features/auth/validation";
import { ErrorAlert } from "~/features/shared/components/error-alert";
import { useI18n } from "~/lib/i18n";

interface RegisterFormProps {
  error?: string;
  isSubmitting?: boolean;
}

export function RegisterForm({
  error,
  isSubmitting = false,
}: RegisterFormProps) {
  const { t } = useI18n();

  const registerSchema = createRegisterSchema(t);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
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
            <ErrorAlert message={error} />

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
                  <FormControl>
                    <PasswordInput
                      placeholder={t("auth.register.form.password.placeholder")}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
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
                  <FormControl>
                    <PasswordInput
                      placeholder={t(
                        "auth.register.form.confirmPassword.placeholder",
                      )}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
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
