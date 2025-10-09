import type { AuthenticatedMenuProps } from "../types/type";

import { UserActions } from "./user-actions";
import { UserProfile } from "./user-profile";

export function AuthenticatedMenuContent({
  userName,
  userEmail,
  onClose,
}: AuthenticatedMenuProps) {
  return (
    <div className="flex flex-col gap-4">
      <UserProfile
        userName={userName}
        userEmail={userEmail}
        onClose={onClose}
      />
      <UserActions onClose={onClose} />
    </div>
  );
}
