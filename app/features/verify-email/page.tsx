import { CheckCircle, Mail, XCircle } from "lucide-react";
import { Link } from "react-router";

import type { VerifyEmailPageProps } from "./types/type";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useI18n } from "~/lib/i18n";

export function VerifyEmailPage({
  isSuccess,
  error,
  message,
}: VerifyEmailPageProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("auth.verifyEmail.title")}
          </CardTitle>
          <CardDescription>{t("auth.verifyEmail.description")}</CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="space-y-4">
              <Alert className="border-primary bg-primary/5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">
                  {t("auth.verifyEmail.success.title")}
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {message}
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <Button asChild className="w-full">
                  <a href="/login">
                    {t("auth.verifyEmail.success.goToSignIn")}
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>{t("auth.verifyEmail.error.title")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="text-center">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">
                    {t("auth.verifyEmail.error.backToSignIn")}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
