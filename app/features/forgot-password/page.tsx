import { useActionData } from "react-router";

import { BrandLogo } from "~/features/shared/components/brand-logo";

import { AgreementsFooter } from "../shared/components/agreements-footer";
import { RequestEmailForm } from "./components/request-email-form";
import { SuccessVerificationToken } from "./components/success-verification-token";

export function ForgotPasswordPage() {
  const actionData = useActionData();
  const { success: isSuccess } = actionData || {};

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-md justify-between items-stretch">
        <BrandLogo url="/" className="self-center" />
        {isSuccess ? <SuccessVerificationToken /> : <RequestEmailForm />}
        <AgreementsFooter />
      </div>
    </div>
  );
}
