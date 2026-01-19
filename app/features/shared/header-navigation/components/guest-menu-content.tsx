import { useTranslation } from "@kotonosora/i18n-react";
import { Link } from "react-router";

import type { MenuCloseHandler } from "../types/type";

import { Button } from "~/components/ui/button";

export function GuestMenuContent({ onClose }: MenuCloseHandler) {
  const t = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" size="sm" asChild className="w-full">
        <Link to="/login" onClick={onClose}>
          {t("navigation.signIn")}
        </Link>
      </Button>
      <Button size="sm" asChild className="w-full">
        <Link to="/register" onClick={onClose}>
          {t("navigation.signUp")}
        </Link>
      </Button>
    </div>
  );
}
