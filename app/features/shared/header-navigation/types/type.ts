import type { RefObject } from "react";

export type NavigationProps = {
  onNavigate: () => void;
};

export type AuthenticatedMenuProps = NavigationProps & {
  userName?: string;
};

export type AuthenticatedMobileMenuProps = NavigationProps & {
  userName?: string;
  userEmail?: string;
};

export type MobileNavigationProps = NavigationProps & {
  isOpen: boolean;
};

export type MobileMenuButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
};

export type GuestMobileMenuProps = NavigationProps;

export type UserInitialAvatarProps = {
  initial?: string;
  title?: string;
};
