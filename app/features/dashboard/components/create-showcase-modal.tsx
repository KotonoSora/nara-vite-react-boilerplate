import { Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { FC } from "react";

import type { FieldError } from "~/features/landing-page/schemas/create-showcase.schema";

import {
  AlertDialog,
  AlertDialogAction,
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
import { cn } from "~/lib/utils";

interface CreateShowcaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateShowcaseFormData) => Promise<void>;
  availableTags: string[];
  serverFieldErrors?: FieldError;
}

export interface CreateShowcaseFormData {
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
export const CreateShowcaseModal: FC<CreateShowcaseModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  availableTags,
  serverFieldErrors,
}) => {
  const [formData, setFormData] = useState<CreateShowcaseFormData>({
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
      setErrorMessage("Please fix the validation errors");
    }
  }, [serverFieldErrors]);

  // Reset form whenever modal is opened fresh
  useEffect(() => {
    if (!open) return;
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
  }, [open]);

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
    field: keyof CreateShowcaseFormData,
    value: string | Date | undefined,
  ) => {
    if (typeof value === undefined || value === "") {
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
        setErrorMessage("Please fix the errors below");
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
    field: keyof CreateShowcaseFormData,
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
        setErrorMessage("Please fix the errors below");
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
        error instanceof Error ? error.message : "Failed to create showcase";
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
            <DialogTitle>Create New Showcase</DialogTitle>
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
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Showcase name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleFieldBlur("name", formData.name)}
                disabled={isSubmitting}
                className={fieldErrors.name ? "border-destructive" : ""}
              />
              {fieldErrors.name && (
                <p className="text-sm text-destructive">{fieldErrors.name}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Showcase description"
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
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* URL Field */}
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                onBlur={() => handleFieldBlur("url", formData.url)}
                disabled={isSubmitting}
                className={fieldErrors.url ? "border-destructive" : ""}
              />
              {fieldErrors.url && (
                <p className="text-sm text-destructive">{fieldErrors.url}</p>
              )}
            </div>

            {/* Image Field */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image || ""}
                onChange={(e) => handleInputChange("image", e.target.value)}
                onBlur={() => handleFieldBlur("image", formData.image)}
                disabled={isSubmitting}
                className={fieldErrors.image ? "border-destructive" : ""}
              />
              {fieldErrors.image && (
                <p className="text-sm text-destructive">{fieldErrors.image}</p>
              )}
            </div>

            {/* Publish Date Field */}
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Publish Date</Label>
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
              <Label>Tags</Label>
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
                        ? "Select or add tags..."
                        : `${formData.tags.length} tag(s) selected`}
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
                      placeholder="Search or add new tag..."
                      value={tagSearchValue}
                      onValueChange={setTagSearchValue}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <div className="space-y-2 py-2">
                          <p className="text-sm text-muted-foreground">
                            No tags found.
                          </p>
                          {tagSearchValue.trim() && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-full"
                              onClick={() => handleSelectTag(tagSearchValue)}
                            >
                              Add "{tagSearchValue.trim()}"
                            </Button>
                          )}
                        </div>
                      </CommandEmpty>
                      <CommandGroup heading="Available Tags">
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
                          <CommandGroup heading="Add New">
                            <CommandItem
                              value={tagSearchValue}
                              onSelect={() => handleSelectTag(tagSearchValue)}
                            >
                              <Check className="mr-2 h-4 w-4 opacity-0" />
                              Add "{tagSearchValue.trim()}"
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
                        aria-label={`Remove ${tag}`}
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
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !hasUnsavedChanges ||
                Object.keys(fieldErrors).length > 0
              }
            >
              {isSubmitting ? "Creating..." : "Create Showcase"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Warning */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes in the showcase form. Are you sure you want
            to close without saving?
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
