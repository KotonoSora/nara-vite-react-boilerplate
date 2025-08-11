import { AgreementsFooter } from "~/features/auth/components/agreements-footer";
import { AuthCard } from "~/features/auth/components/auth-card";
import { RegisterForm } from "~/features/register/components/register-form";

import { usePageContext } from "./context/page-context";

export function ContentRegisterPage() {
  const { error } = usePageContext();

  return (
    <AuthCard>
      <RegisterForm error={error} isSubmitting={false} />
      <AgreementsFooter />
    </AuthCard>
  );
}
