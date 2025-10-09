import { Link } from "react-router";

import type { GuestMenuContentProps } from "../types/type";

import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n/context";

export function GuestMenuContent({ onClose }: GuestMenuContentProps) {
  const { t } = useI18n();

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
