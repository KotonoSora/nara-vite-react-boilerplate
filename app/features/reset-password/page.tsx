import { AlertCircle, Lock } from "lucide-react";
import { Link } from "react-router";

import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useI18n } from "~/lib/i18n";

export function ResetPasswordPage(props: {
  token: string;
  errors?: Record<string, string[]>;
  error?: string;
}) {
  const { token, errors, error } = props;
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth.resetPassword.heading")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.resetPassword.subheading")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form method="post" className="space-y-4">
            <input type="hidden" name="token" value={token} />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {t("auth.resetPassword.passwordLabel")}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder={t("auth.resetPassword.passwordPlaceholder")}
                  className={errors?.password ? "border-destructive" : ""}
                  required
                />
                {errors?.password && (
                  <p className="text-sm text-destructive">
                    {errors.password[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t("auth.resetPassword.confirmPasswordLabel")}
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder={t(
                    "auth.resetPassword.confirmPasswordPlaceholder",
                  )}
                  className={
                    errors?.confirmPassword ? "border-destructive" : ""
                  }
                  required
                />
                {errors?.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {t("auth.resetPassword.errorPasswordsDoNotMatch")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {t("auth.resetPassword.passwordRequirements")}
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {t("auth.resetPassword.requirementLength")}
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {t("auth.resetPassword.requirementUppercase")}
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {t("auth.resetPassword.requirementLowercase")}
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {t("auth.resetPassword.requirementNumber")}
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {t("auth.resetPassword.requirementSpecial")}
                </li>
              </ul>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              {t("auth.resetPassword.submitButton")}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" asChild className="p-0">
              <Link to="/login">{t("auth.resetPassword.backToSignIn")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
