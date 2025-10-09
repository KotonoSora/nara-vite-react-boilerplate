import { LogOut } from "lucide-react";
import { Form } from "react-router";

import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n/context";

export function LogoutButton() {
  const { t } = useI18n();

  return (
    <Form method="post" action="/action/logout">
      <Button
        type="submit"
        variant="outline"
        size="sm"
        title={t("navigation.signOut")}
      >
        <LogOut className="h-4 w-4" aria-label={t("navigation.signOut")} />
      </Button>
    </Form>
  );
}
