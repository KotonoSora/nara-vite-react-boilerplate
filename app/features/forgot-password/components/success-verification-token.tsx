import { CheckCircle2 } from "lucide-react";
import { Link, useActionData } from "react-router";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

export function SuccessVerificationToken() {
  const actionData = useActionData();
  const { message } = actionData || {};
  const t = useTranslation();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {t("auth.forgotPassword.successHeading")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.forgotPassword.successSubheading")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="default" className="border-primary/20 bg-primary/10">
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
  );
}
