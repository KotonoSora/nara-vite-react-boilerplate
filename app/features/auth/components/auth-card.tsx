import { BrandLogo } from "~/features/shared/components/brand-logo";

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <BrandLogo to="/" />
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}
