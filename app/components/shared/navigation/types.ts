import type { ComponentProps } from "react";

export interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
  protected?: boolean;
}

export interface NavigationProps extends ComponentProps<"nav"> {
  items: NavigationItem[];
  className?: string;
}

export interface MobileNavigationProps extends NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface HeaderNavigationProps {
  showAuth?: boolean;
  showLanguageSwitcher?: boolean;
  showModeSwitcher?: boolean;
  showGitHub?: boolean;
  customItems?: NavigationItem[];
}