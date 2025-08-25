import { AgreementsFooter } from "../auth/components/agreements-footer";
import { BrandLogo } from "../shared/components/brand-logo";
import { ResetPasswordForm } from "./components/reset-password-form";

export function ResetPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full justify-between items-stretch">
        <BrandLogo url="/" className="self-center" />
        <ResetPasswordForm />
        <AgreementsFooter />
      </div>
    </div>
  );
}
