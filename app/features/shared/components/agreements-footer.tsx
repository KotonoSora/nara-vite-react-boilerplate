import { Link } from "react-router";

import { useTranslation } from "~/lib/i18n/hooks/use-translation";

export function AgreementsFooter() {
  const t = useTranslation();

  return (
    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      {t("auth.common.agreementText")}{" "}
      <Link to="/terms">{t("auth.common.termsOfService")}</Link>{" "}
      {t("auth.common.and")}{" "}
      <Link to="/privacy">{t("auth.common.privacyPolicy")}</Link>.
    </div>
  );
}
