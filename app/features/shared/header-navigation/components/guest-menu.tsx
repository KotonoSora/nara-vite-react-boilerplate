import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n/context";

export function GuestMenu() {
  const { t } = useI18n();

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/about">{t("navigation.about")}</Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/login">{t("navigation.signIn")}</Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/register">{t("navigation.signUp")}</Link>
      </Button>
    </div>
  );
}
