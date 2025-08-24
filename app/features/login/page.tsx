import { AgreementsFooter } from "~/features/auth/components/agreements-footer";
import { BrandLogo } from "~/features/landing-page/components/brand-logo";
import { LoginForm } from "~/features/login/components/login-form";

import { usePageContext } from "./context/page-context";

export function ContentLoginPage() {
  const { error } = usePageContext();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full justify-between items-stretch">
        <BrandLogo url="/" className="self-center" />
        <LoginForm error={error} isSubmitting={false} />
        <AgreementsFooter />
      </div>
    </div>
  );
}
