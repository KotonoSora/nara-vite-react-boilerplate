import { useTranslation } from "@kotonosora/i18n-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@kotonosora/ui/components/ui/alert-dialog";
import { Button } from "@kotonosora/ui/components/ui/button";
import { type FC } from "react";

interface DeleteShowcaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * Confirmation dialog for deleting a showcase.
 * Allows user to confirm or cancel the deletion action.
 */
export const DeleteShowcaseDialog: FC<DeleteShowcaseDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}) => {
  const t = useTranslation();

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>
          {t("dashboard.deleteShowcase.title")}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {t("dashboard.deleteShowcase.description")}
        </AlertDialogDescription>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            {t("cancel")}
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? t("dashboard.deleteShowcase.deleting") : t("delete")}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
