import { AgreementsFooter } from "~/features/auth/components/agreements-footer";
import { AuthCard } from "~/features/auth/components/auth-card";
import { LoginForm } from "~/features/login/components/login-form";

import { usePageContext } from "./context/page-context";

export function ContentLoginPage() {
  const { error } = usePageContext();
  return (
    <AuthCard>
      <LoginForm error={error} isSubmitting={false} />
      <AgreementsFooter />
    </AuthCard>
  );
}
