export type MenuCloseHandler = {
  onClose: () => void;
};

export type AuthenticatedMenuProps = MenuCloseHandler & {
  userName?: string;
  userEmail?: string;
};

export type MenuTriggerProps = {
  isOpen: boolean;
};
