export type NavigationProps = {
  onClose: () => void;
};

export type AuthenticatedMenuContentProps = NavigationProps & {
  userName?: string;
  userEmail?: string;
};

export type NavigationMenuProps = NavigationProps;

export type NavigationMenuTriggerProps = {
  isOpen: boolean;
};

export type GuestMenuContentProps = NavigationProps;
