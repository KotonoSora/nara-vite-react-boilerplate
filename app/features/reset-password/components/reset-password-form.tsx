import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Link } from "react-router";
import { z } from "zod";

import type { TranslationFunctionType } from "~/lib/i18n/translations";

import { Alert, AlertDescription } from "~/components/ui/alert";
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
import { useI18n } from "~/lib/i18n/context";

import { usePageContext } from "../context/page-context";
import { PasswordRequirement } from "./password-requirement";

const minLengthSchema = z.string().min(8);
const uppercaseSchema = z.string().regex(/[A-Z]/);
const lowercaseSchema = z.string().regex(/[a-z]/);
const numberSchema = z.string().regex(/\d/);
const specialCharSchema = z.string().regex(/[!@#$%^&*(),.?":{}|<>]/);

const createResetPasswordSchema = (t: TranslationFunctionType) =>
  z
    .object({
      password: z
        .string()
        .min(8, t("auth.resetPassword.errorWeakPassword"))
        .regex(/[A-Z]/, t("auth.resetPassword.errorWeakPassword"))
        .regex(/[a-z]/, t("auth.resetPassword.errorWeakPassword"))
        .regex(/\d/, t("auth.resetPassword.errorWeakPassword"))
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          t("auth.resetPassword.errorWeakPassword"),
        ),
      confirmPassword: z
        .string()
        .min(1, t("auth.resetPassword.errorConfirmPasswordMissing")),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: t("auth.resetPassword.errorPasswordsDoNotMatch"),
        });
      }
    });

type ResetPasswordFormData = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

function usePasswordRequirements(password: string) {
  return {
    minLength: minLengthSchema.safeParse(password).success,
    hasUppercase: uppercaseSchema.safeParse(password).success,
    hasLowercase: lowercaseSchema.safeParse(password).success,
    hasNumber: numberSchema.safeParse(password).success,
    hasSpecialChar: specialCharSchema.safeParse(password).success,
  };
}

export function ResetPasswordForm() {
  const { token, error } = usePageContext();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordSchema = createResetPasswordSchema(t);
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = form.watch("password");
  const requirements = usePasswordRequirements(password);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("auth.resetPassword.heading")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.resetPassword.subheading")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormProvider {...form}>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="token" value={token} />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("auth.resetPassword.passwordLabel")}
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t(
                            "auth.resetPassword.passwordPlaceholder",
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
                      {t("auth.resetPassword.confirmPasswordLabel")}
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t(
                            "auth.resetPassword.confirmPasswordPlaceholder",
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
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Real-time password requirements */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {t("auth.resetPassword.passwordRequirements")}
              </p>
              <ul className="space-y-1">
                <PasswordRequirement met={requirements.minLength}>
                  {t("auth.resetPassword.requirementLength")}
                </PasswordRequirement>
                <PasswordRequirement met={requirements.hasUppercase}>
                  {t("auth.resetPassword.requirementUppercase")}
                </PasswordRequirement>
                <PasswordRequirement met={requirements.hasLowercase}>
                  {t("auth.resetPassword.requirementLowercase")}
                </PasswordRequirement>
                <PasswordRequirement met={requirements.hasNumber}>
                  {t("auth.resetPassword.requirementNumber")}
                </PasswordRequirement>
                <PasswordRequirement met={requirements.hasSpecialChar}>
                  {t("auth.resetPassword.requirementSpecial")}
                </PasswordRequirement>
              </ul>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? t("auth.resetPassword.submitting")
                : t("auth.resetPassword.submitButton")}
            </Button>
          </Form>
        </FormProvider>

        <div className="text-center">
          <Button variant="link" asChild className="p-0">
            <Link to="/login">{t("auth.resetPassword.backToSignIn")}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
