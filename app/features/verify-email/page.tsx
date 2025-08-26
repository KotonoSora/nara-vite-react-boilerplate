import type { VerifyEmailPageProps } from "./types/type";

import { AgreementsFooter } from "../shared/components/agreements-footer";
import { BrandLogo } from "../shared/components/brand-logo";
import { ResultCheckToken } from "./components/result-check-token";

export function VerifyEmailPage({
  isSuccess,
  error,
  message,
}: VerifyEmailPageProps) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-md justify-between items-stretch">
        <BrandLogo url="/" className="self-center" />
        <ResultCheckToken
          isSuccess={isSuccess}
          error={error}
          message={message}
        />
        <AgreementsFooter />
      </div>
    </div>
  );
}
