import { Home, LogOut } from "lucide-react";
import { Form, Link } from "react-router";

import type { MenuCloseHandler } from "../types/type";

import { Button } from "~/components/ui/button";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

export function UserActions({ onClose }: MenuCloseHandler) {
  const t = useTranslation();

  return (
    <div className="flex gap-4">
      <Button variant="outline" size="sm" asChild>
        <Link to="/" onClick={onClose} title={t("navigation.home")}>
          <Home className="h-4 w-4" />
        </Link>
      </Button>
      <Form method="post" action="/action/logout">
        <Button
          type="submit"
          variant="outline"
          size="sm"
          onClick={onClose}
          title={t("navigation.signOut")}
        >
          <LogOut className="h-4 w-4" aria-label={t("navigation.signOut")} />
        </Button>
      </Form>
    </div>
  );
}
