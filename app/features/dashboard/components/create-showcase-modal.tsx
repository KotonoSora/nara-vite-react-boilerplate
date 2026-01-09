import { X } from "lucide-react";
import { useEffect, useState } from "react";

import type { FC } from "react";

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
import { cn } from "~/lib/utils";

interface CreateShowcaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateShowcaseFormData) => Promise<void>;
  availableTags: string[];
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
  const [openTagsPopover, setOpenTagsPopover] = useState(false);

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

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
        url: "",
        image: "",
        publishedAt: undefined,
        tags: [],
      });
      setHasUnsavedChanges(false);
      setOpenTagsPopover(false);
    }
  }, [open]);

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
   * Toggles a tag in the selected tags list.
   */
  const handleTagToggle = (tag: string) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
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
   * Handles form submission.
   */
  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.url.trim()
    ) {
      // TODO: Add toast error for validation
      console.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create showcase";
      console.error("Failed to create showcase:", message);
      // TODO: Add toast error
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
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Showcase name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isSubmitting}
              />
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
                disabled={isSubmitting}
                rows={4}
              />
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
                disabled={isSubmitting}
              />
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
                disabled={isSubmitting}
              />
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
              <Popover open={openTagsPopover} onOpenChange={setOpenTagsPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isSubmitting}
                  >
                    {formData.tags.length === 0
                      ? "Select tags..."
                      : `${formData.tags.length} tag(s) selected`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-3" align="start">
                  <div className="space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <label
                          key={tag}
                          className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.tags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>
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
            <Button onClick={handleSubmit} disabled={isSubmitting}>
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
