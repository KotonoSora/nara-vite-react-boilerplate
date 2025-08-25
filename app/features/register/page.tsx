import { AgreementsFooter } from "~/features/auth/components/agreements-footer";
import { RegisterForm } from "~/features/register/components/register-form";
import { BrandLogo } from "~/features/shared/components/brand-logo";

import { usePageContext } from "./context/page-context";

export function ContentRegisterPage() {
  const { error } = usePageContext();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full justify-between items-stretch">
        <BrandLogo url="/" className="self-center" />
        <RegisterForm error={error} isSubmitting={false} />
        <AgreementsFooter />
      </div>
    </div>
  );
}
