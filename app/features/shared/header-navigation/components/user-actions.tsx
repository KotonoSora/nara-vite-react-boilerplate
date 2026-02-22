import { useTranslation } from "@kotonosora/i18n-react";
import { Button } from "@kotonosora/ui/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { Form, Link } from "react-router";

import type { MenuCloseHandler } from "../types/type";

export function UserActions({ onClose }: MenuCloseHandler) {
  const t = useTranslation();

  return (
    <div className="flex gap-4">
      <Button variant="outline" size="sm" asChild className="cursor-pointer">
        <Link
          to="/"
          onClick={onClose}
          title={t("navigation.home")}
          discover="none"
        >
          <Home className="h-4 w-4" />
        </Link>
      </Button>
      <Form method="post" action="/action/logout">
        <Button
          className="cursor-pointer"
          type="submit"
          variant="outline"
          size="sm"
          title={t("navigation.signOut")}
        >
          <LogOut className="h-4 w-4" aria-label={t("navigation.signOut")} />
        </Button>
      </Form>
    </div>
  );
}
