import { AlertCircle } from "lucide-react";
import { Link } from "react-router";

import { Alert, AlertTitle } from "~/components/ui/alert";
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
import { useI18n } from "~/lib/i18n/context";

import { usePageContext } from "../context/page-context";

export function RequestEmailForm() {
  const { error } = usePageContext();
  const { t } = useI18n();

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
  );
}
