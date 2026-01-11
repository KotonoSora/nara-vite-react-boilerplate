import { Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { FC } from "react";

import type { FieldError } from "~/features/landing-page/schemas/create-showcase.schema";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import {
  createShowcaseSchema,
  parseValidationErrors,
} from "~/features/landing-page/schemas/create-showcase.schema";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";
import { cn } from "~/lib/utils";

interface ShowcaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ShowcaseFormData) => Promise<void>;
  availableTags: string[];
  serverFieldErrors?: FieldError;
  mode?: "create" | "edit";
  showcase?: ShowcaseFormData & { id: string };
}

export interface ShowcaseFormData {
  name: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: Date;
  tags: string[];
}

/**
 * Modal for creating a new showcase with form validation and unsaved changes warning.
 * Shows an alert dialog if user attempts to close with unsaved data.
 */
export const ShowcaseModal: FC<ShowcaseModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  availableTags,
  serverFieldErrors,
  mode = "create",
  showcase,
}) => {
  const t = useTranslation();
  const [formData, setFormData] = useState<ShowcaseFormData>({
    name: "",
    description: "",
    url: "",
    image: "",
    publishedAt: undefined,
    tags: [],
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openTagsCombobox, setOpenTagsCombobox] = useState(false);
  const [tagSearchValue, setTagSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});

  // Track unsaved changes
  useEffect(() => {
    const hasChanges =
      formData.name.trim() !== "" ||
      formData.description.trim() !== "" ||
      formData.url.trim() !== "" ||
      formData.image?.trim() !== "" ||
      formData.tags.length > 0;

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  // Sync server field errors when modal opens or data changes
  useEffect(() => {
    if (serverFieldErrors && Object.keys(serverFieldErrors).length > 0) {
      setFieldErrors(serverFieldErrors);
      setErrorMessage(t("dashboard.showcaseModal.validationError"));
    }
  }, [serverFieldErrors, t]);

  // Reset form whenever modal is opened fresh
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && showcase) {
      // Pre-fill form with showcase data in edit mode
      setFormData({
        name: showcase.name,
        description: showcase.description,
        url: showcase.url,
        image: showcase.image || "",
        publishedAt: showcase.publishedAt,
        tags: showcase.tags,
      });
    } else {
      // Reset to empty form in create mode
      setFormData({
        name: "",
        description: "",
        url: "",
        image: "",
        publishedAt: undefined,
        tags: [],
      });
    }

    setFieldErrors({});
    setErrorMessage("");
    setHasUnsavedChanges(false);
  }, [open, mode, showcase]);

  // Clear global error message when all field errors are resolved
  useEffect(() => {
    if (Object.keys(fieldErrors).length === 0) {
      setErrorMessage("");
    }
  }, [fieldErrors]);

  /**
   * Handles field blur event to validate and clear errors for valid fields.
   * Validates only the blurred field using the schema to avoid cross-field noise.
   */
  const handleFieldBlur = (
    field: keyof ShowcaseFormData,
    value: string | Date | undefined,
  ) => {
    if (value === undefined || value === "") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return;
    }

    // Validate only this field to prevent other empty fields from blocking clearance
    const fieldSchema = createShowcaseSchema.pick({ [field]: true });
    const result = fieldSchema.safeParse({ [field]: value });

    if (!result.success) {
      const errors = parseValidationErrors(result);
      if (errors) {
        setFieldErrors((prev) => ({ ...prev, ...errors }));
        setErrorMessage(t("dashboard.showcaseModal.fieldError"));
      }
      return;
    }

    if (result.success && fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return;
    }
  };

  /**
   * Handles input changes for all form fields.
   */
  const handleInputChange = (
    field: keyof ShowcaseFormData,
    value: string | Date | undefined,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handles tag selection/deselection from combobox.
   * Supports adding new custom tags that don't exist in availableTags.
   */
  const handleSelectTag = (tagValue: string) => {
    const trimmedTag = tagValue.trim();
    if (!trimmedTag) return;

    setFormData((prev) => {
      const isSelected = prev.tags.includes(trimmedTag);
      const tags = isSelected
        ? prev.tags.filter((t) => t !== trimmedTag)
        : [...prev.tags, trimmedTag];
      return { ...prev, tags };
    });
    setTagSearchValue("");
  };

  /**
   * Removes a specific tag from the selected tags.
   */
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  /**
   * Handles modal close with unsaved changes warning.
   */
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasUnsavedChanges) {
      setShowWarning(true);
      return;
    }
    // When closing, reset form to pristine state
    if (!newOpen) {
      setFormData({
        name: "",
        description: "",
        url: "",
        image: "",
        publishedAt: undefined,
        tags: [],
      });
      setFieldErrors({});
      setErrorMessage("");
      setHasUnsavedChanges(false);
    }
    onOpenChange(newOpen);
  };

  /**
   * Confirms closing the modal and discards unsaved changes.
   */
  const handleConfirmClose = () => {
    setShowWarning(false);
    onOpenChange(false);
  };

  /**
   * Handles form submission with client-side validation first.
   */
  const handleSubmit = async () => {
    setErrorMessage("");
    setFieldErrors({});

    // Client-side validation
    const result = createShowcaseSchema.safeParse({
      name: formData.name,
      description: formData.description,
      url: formData.url,
      image: formData.image,
      publishedAt: formData.publishedAt,
      tags: formData.tags,
    });

    if (!result.success) {
      const errors = parseValidationErrors(result);
      if (errors) {
        setFieldErrors(errors);
        setErrorMessage(t("dashboard.showcaseModal.fieldError"));
      }
      return;
    }

    // Validation passed, submit to server
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Modal will close only on success (handled in manage-showcases)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("dashboard.showcaseModal.submitError");
      setErrorMessage(message);
      console.error("Failed to create showcase:", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit"
                ? t("dashboard.showcaseModal.titleEdit")
                : t("dashboard.showcaseModal.titleCreate")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {t("dashboard.showcaseModal.nameLabel")}
              </Label>
              <Input
                id="name"
                placeholder={t("dashboard.showcaseModal.namePlaceholder")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleFieldBlur("name", formData.name)}
                disabled={isSubmitting}
                className={fieldErrors.name ? "border-destructive" : ""}
              />
              {fieldErrors.name && (
                <p className="text-sm text-destructive">
                  {t(fieldErrors.name)}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {t("dashboard.showcaseModal.descriptionLabel")}
              </Label>
              <Textarea
                id="description"
                placeholder={t(
                  "dashboard.showcaseModal.descriptionPlaceholder",
                )}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                onBlur={() =>
                  handleFieldBlur("description", formData.description)
                }
                disabled={isSubmitting}
                rows={4}
                className={fieldErrors.description ? "border-destructive" : ""}
              />
              {fieldErrors.description && (
                <p className="text-sm text-destructive">
                  {t(fieldErrors.description)}
                </p>
              )}
            </div>

            {/* URL Field */}
            <div className="space-y-2">
              <Label htmlFor="url">
                {t("dashboard.showcaseModal.urlLabel")}
              </Label>
              <Input
                id="url"
                type="url"
                placeholder={t("dashboard.showcaseModal.urlPlaceholder")}
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                onBlur={() => handleFieldBlur("url", formData.url)}
                disabled={isSubmitting}
                className={fieldErrors.url ? "border-destructive" : ""}
              />
              {fieldErrors.url && (
                <p className="text-sm text-destructive">{t(fieldErrors.url)}</p>
              )}
            </div>

            {/* Image Field */}
            <div className="space-y-2">
              <Label htmlFor="image">
                {t("dashboard.showcaseModal.imageLabel")}
              </Label>
              <Input
                id="image"
                type="url"
                placeholder={t("dashboard.showcaseModal.imagePlaceholder")}
                value={formData.image || ""}
                onChange={(e) => handleInputChange("image", e.target.value)}
                onBlur={() => handleFieldBlur("image", formData.image)}
                disabled={isSubmitting}
                className={fieldErrors.image ? "border-destructive" : ""}
              />
              {fieldErrors.image && (
                <p className="text-sm text-destructive">
                  {t(fieldErrors.image)}
                </p>
              )}
            </div>

            {/* Publish Date Field */}
            <div className="space-y-2">
              <Label htmlFor="publishedAt">
                {t("dashboard.showcaseModal.publishedAtLabel")}
              </Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={
                  formData.publishedAt
                    ? formData.publishedAt.toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange(
                    "publishedAt",
                    value ? new Date(value) : undefined,
                  );
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <Label>{t("dashboard.showcaseModal.tagsLabel")}</Label>
              <Popover
                open={openTagsCombobox}
                onOpenChange={setOpenTagsCombobox}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openTagsCombobox}
                    className="w-full justify-between"
                    disabled={isSubmitting}
                  >
                    <span className="truncate">
                      {formData.tags.length === 0
                        ? t("dashboard.showcaseModal.tagsButtonEmpty")
                        : t("dashboard.showcaseModal.tagsButtonCount", {
                            count: formData.tags.length,
                          })}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder={t(
                        "dashboard.showcaseModal.tagsSearchPlaceholder",
                      )}
                      value={tagSearchValue}
                      onValueChange={setTagSearchValue}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <div className="space-y-2 py-2">
                          <p className="text-sm text-muted-foreground">
                            {t("dashboard.showcaseModal.tagsNoResults")}
                          </p>
                          {tagSearchValue.trim() && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-full"
                              onClick={() => handleSelectTag(tagSearchValue)}
                            >
                              {t("dashboard.showcaseModal.tagsAdd", {
                                tag: tagSearchValue.trim(),
                              })}
                            </Button>
                          )}
                        </div>
                      </CommandEmpty>
                      <CommandGroup
                        heading={t(
                          "dashboard.showcaseModal.tagsAvailableHeading",
                        )}
                      >
                        {availableTags.map((tag) => {
                          const isSelected = formData.tags.includes(tag);
                          return (
                            <CommandItem
                              key={tag}
                              value={tag}
                              onSelect={() => handleSelectTag(tag)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {tag}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                      {tagSearchValue.trim() &&
                        !availableTags.includes(tagSearchValue.trim()) &&
                        tagSearchValue.trim().toLowerCase() !==
                          availableTags
                            .find(
                              (t) =>
                                t.toLowerCase() ===
                                tagSearchValue.trim().toLowerCase(),
                            )
                            ?.toLowerCase() && (
                          <CommandGroup
                            heading={t(
                              "dashboard.showcaseModal.tagsAddHeading",
                            )}
                          >
                            <CommandItem
                              value={tagSearchValue}
                              onSelect={() => handleSelectTag(tagSearchValue)}
                            >
                              <Check className="mr-2 h-4 w-4 opacity-0" />
                              {t("dashboard.showcaseModal.tagsAdd", {
                                tag: tagSearchValue.trim(),
                              })}
                            </CommandItem>
                          </CommandGroup>
                        )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected Tags Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive transition-colors"
                        aria-label={t("dashboard.showcaseModal.tagRemoveAria", {
                          tag,
                        })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("dashboard.showcaseModal.actionsCancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !hasUnsavedChanges ||
                Object.keys(fieldErrors).length > 0
              }
            >
              {isSubmitting
                ? mode === "edit"
                  ? t("dashboard.showcaseModal.actionsUpdating")
                  : t("dashboard.showcaseModal.actionsCreating")
                : mode === "edit"
                  ? t("dashboard.showcaseModal.actionsUpdate")
                  : t("dashboard.showcaseModal.actionsCreate")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Warning */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogTitle>
            {t("dashboard.showcaseModal.unsavedTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("dashboard.showcaseModal.unsavedDescription")}
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>
              {t("dashboard.showcaseModal.unsavedKeepEditing")}
            </AlertDialogCancel>
            <Button onClick={handleConfirmClose} variant="destructive">
              {t("dashboard.showcaseModal.unsavedDiscard")}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
