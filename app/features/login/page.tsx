import { AgreementsFooter } from "~/features/auth/components/agreements-footer";
import { BrandLogo } from "~/features/landing-page/components/brand-logo";
import { LoginForm } from "~/features/login/components/login-form";

import { usePageContext } from "./context/page-context";

export function ContentLoginPage() {
  const { error } = usePageContext();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <BrandLogo url="/" className="self-center" />
        <div className="flex flex-col gap-6">
          <LoginForm error={error} isSubmitting={false} />
          <AgreementsFooter />
        </div>
      </div>
    </div>
  );
}
