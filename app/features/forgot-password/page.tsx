import { BrandLogo } from "~/features/shared/components/brand-logo";

import { AgreementsFooter } from "../auth/components/agreements-footer";
import { RequestEmailForm } from "./components/request-email-form";
import { SuccessVerificationToken } from "./components/success-verification-token";
import { usePageContext } from "./context/page-context";

export function ForgotPasswordPage() {
  const { isSuccess } = usePageContext();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full justify-between items-stretch">
        <BrandLogo url="/" className="self-center" />
        {isSuccess ? <SuccessVerificationToken /> : <RequestEmailForm />}
        <AgreementsFooter />
      </div>
    </div>
  );
}
