import type { UserInitialAvatarProps } from "../types/type";

export function UserInitialAvatar({ initial, title }: UserInitialAvatarProps) {
  return (
    <div
      className="relative inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium"
      aria-label={title}
    >
      {initial}
    </div>
  );
}
