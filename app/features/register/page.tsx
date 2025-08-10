import { Link } from "react-router";

import { RegisterForm } from "~/features/register/components/register-form";
import { useI18n } from "~/lib/i18n";

import { usePageContext } from "./context/page-context";

export function ContentRegisterPage() {
  const { error } = usePageContext();
  const { t } = useI18n();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center text-xl font-bold"
        >
          <img
            src="/assets/logo-dark.svg"
            alt=""
            className="w-8 h-8 hidden [html.dark_&]:block"
            loading="lazy"
          />
          <img
            src="/assets/logo-light.svg"
            alt=""
            className="w-8 h-8 hidden [html.light_&]:block"
            loading="lazy"
          />
          NARA
        </Link>
        <div className="flex flex-col gap-6">
          <RegisterForm error={error} isSubmitting={false} />
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            {t("auth.common.agreementText")}{" "}
            <Link to="/terms">{t("auth.common.termsOfService")}</Link>{" "}
            {t("auth.common.and")}{" "}
            <Link to="/privacy">{t("auth.common.privacyPolicy")}</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
