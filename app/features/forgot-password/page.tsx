import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
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

export function ForgotPasswordPage(props: {
  isSuccess?: boolean;
  error?: string | null;
  message?: string | null;
}) {
  const { isSuccess, error, message } = props;
  const { t } = useI18n();

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {t("auth.forgotPassword.successHeading")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert
              variant="default"
              className="border-primary/20 bg-primary/10"
            >
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary">
                {t("auth.forgotPassword.successSubheading")}
              </AlertTitle>
              <AlertDescription className="text-primary/80">
                {message}
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Button
                asChild
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
              >
                <Link to="/login">{t("auth.forgotPassword.backToSignIn")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth.forgotPassword.heading")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.forgotPassword.subheading")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" method="post">
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                {t("auth.forgotPassword.emailLabel")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t("auth.forgotPassword.emailPlaceholder")}
                className="w-full"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <AlertTitle className="text-sm font-medium text-destructive-foreground">
                  {error}
                </AlertTitle>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
