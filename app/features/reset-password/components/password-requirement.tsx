import { Check, X } from "lucide-react";

import type { ReactNode } from "react";

export function PasswordRequirement({
  met,
  children,
}: {
  met: boolean;
  children: ReactNode;
}) {
  return (
    <li
      className={`flex items-center text-xs ${met ? "text-green-600" : "text-muted-foreground"}`}
    >
      {met ? (
        <Check className="h-3 w-3 mr-2" />
      ) : (
        <X className="h-3 w-3 mr-2" />
      )}
      {children}
    </li>
  );
}
