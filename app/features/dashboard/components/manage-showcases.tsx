import { useI18n } from "@kotonosora/i18n-react";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import { toast } from "sonner";

import type { FC } from "react";

import type { ShowcaseItem } from "~/features/landing-page/utils/fetch-showcases";

import type { DashboardContentProps } from "../types/type";
import type { ShowcaseFormData } from "./showcase-modal";

import { Button } from "~/components/ui/button";

import { DeleteShowcaseDialog } from "./delete-showcase-dialog";
import { ShowcaseModal } from "./showcase-modal";
import { showcasesColumns } from "./showcases-columns";
import { ShowcasesDataTable } from "./showcases-data-table";

/**
 * Data table for managing showcases with CRUD operations.
 * Built with TanStack Table and shadcn/ui data-table pattern.
 */
export const ManageShowcase: FC = () => {
  const { t, language } = useI18n();
  const { showcases, availableTags, user } =
    useLoaderData<DashboardContentProps>();
  const fetcher = useFetcher();
  const { items, total, page, pageSize } = showcases;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState<
    Record<string, string>
  >({});
  const [showcaseToDelete, setShowcaseToDelete] = useState<string | null>(null);
  const [showcaseToEdit, setShowcaseToEdit] = useState<ShowcaseItem | null>(
    null,
  );
  const [lastSubmittedAction, setLastSubmittedAction] = useState<
    "create" | "delete" | "publish" | "unpublish" | "update" | null
  >(null);
  const sortByParam = searchParams.get("sortBy");
  const sortDirParam = searchParams.get("sortDir");
  const searchParam = searchParams.get("search") || "";
  const tagsParam = searchParams.getAll("tags");
  const sortBy =
    sortByParam === "name" ||
    sortByParam === "publishedAt" ||
    sortByParam === "createdAt"
      ? sortByParam
      : ("createdAt" as const);
  const sortDir =
    sortDirParam === "asc" || sortDirParam === "desc"
      ? (sortDirParam as "asc" | "desc")
      : ("desc" as const);

  /**
   * Handles create new showcase action.
   * Opens the create modal.
   */
  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  /**
   * Handles showcase deletion (soft delete via action).
   */
  const handleDelete = (showcaseId: string) => {
    setShowcaseToDelete(showcaseId);
  };

  /**
   * Handles showcase editing.
   * Opens the edit modal with showcase data.
   */
  const handleEdit = (showcaseId: string) => {
    const showcase = items.find((item) => item.id === showcaseId);
    if (showcase) {
      setShowcaseToEdit(showcase);
    }
  };

  /**
   * Handles showcase publishing.
   * Sets publishedAt to current time.
   */
  const handlePublish = (showcaseId: string) => {
    const fd = new FormData();
    fd.append("showcaseId", showcaseId);
    setLastSubmittedAction("publish");
    fetcher.submit(fd, { method: "post", action: "/action/showcase/publish" });
  };

  /**
   * Handles showcase unpublishing.
   * Removes publishedAt to revert to draft.
   */
  const handleUnpublish = (showcaseId: string) => {
    const fd = new FormData();
    fd.append("showcaseId", showcaseId);
    setLastSubmittedAction("unpublish");
    fetcher.submit(fd, {
      method: "post",
      action: "/action/showcase/unpublish",
    });
  };

  /**
   * Confirms and submits the showcase deletion.
   */
  const confirmDelete = () => {
    if (!showcaseToDelete) return;

    const fd = new FormData();
    fd.append("showcaseId", showcaseToDelete);
    setLastSubmittedAction("delete");
    fetcher.submit(fd, { method: "post", action: "/action/showcase/delete" });
    setShowcaseToDelete(null);
  };

  /**
   * Handles showcase creation/update form submission.
   */
  const handleCreateSubmit = async (data: ShowcaseFormData) => {
    const fd = new FormData();

    if (showcaseToEdit) {
      // Update mode
      fd.append("showcaseId", showcaseToEdit.id);
      fd.append("name", data.name);
      fd.append("description", data.description);
      fd.append("url", data.url);
      if (data.image) fd.append("image", data.image);
      if (data.publishedAt)
        fd.append("publishedAt", data.publishedAt.toISOString());
      for (const tag of data.tags) fd.append("tags", tag);

      setLastSubmittedAction("update");
      fetcher.submit(fd, { method: "post", action: "/action/showcase/update" });
    } else {
      // Create mode
      fd.append("name", data.name);
      fd.append("description", data.description);
      fd.append("url", data.url);
      if (data.image) fd.append("image", data.image);
      if (data.publishedAt)
        fd.append("publishedAt", data.publishedAt.toISOString());
      for (const tag of data.tags) fd.append("tags", tag);
      fd.append("authorId", String(user.id));

      setLastSubmittedAction("create");
      fetcher.submit(fd, { method: "post", action: "/action/showcase/new" });
    }

    // Optimistically refresh the table
    const sp = new URLSearchParams(searchParams);
    sp.set("page", "1");
    sp.set("pageSize", String(pageSize));
    setSearchParams(sp);
  };

  // Surface server outcome via toast after fetcher completes
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const result = fetcher.data as {
        error?: string;
        fieldErrors?: Record<string, string>;
        success?: boolean;
      };

      if (result.fieldErrors) {
        // Field validation errors: keep modal open, show field errors in modal
        setServerFieldErrors(result.fieldErrors);
        toast.error(t("dashboard.manageShowcases.fixValidationErrors"));
      } else if (result.error) {
        // Non-field errors: close modal, show toast, refresh table
        toast.error(result.error);
        setIsCreateModalOpen(false);
        setShowcaseToEdit(null);
        setServerFieldErrors({});
        setLastSubmittedAction(null);
        const sp = new URLSearchParams(searchParams);
        sp.set("page", "1");
        sp.set("pageSize", String(pageSize));
        setSearchParams(sp);
      } else if (result.success) {
        if (lastSubmittedAction === "create") {
          // Create success: close modal and reset form
          toast.success(t("dashboard.manageShowcases.created"));
          setIsCreateModalOpen(false);
          setServerFieldErrors({});
        } else if (lastSubmittedAction === "update") {
          // Update success: close modal and reset form
          toast.success(t("dashboard.manageShowcases.updated"));
          setShowcaseToEdit(null);
          setServerFieldErrors({});
          const sp = new URLSearchParams(searchParams);
          sp.set("page", String(page));
          sp.set("pageSize", String(pageSize));
          setSearchParams(sp);
        } else if (lastSubmittedAction === "delete") {
          // Delete success: refresh table
          toast.success(t("dashboard.manageShowcases.deleted"));
          const sp = new URLSearchParams(searchParams);
          sp.set("page", "1");
          sp.set("pageSize", String(pageSize));
          setSearchParams(sp);
        } else if (lastSubmittedAction === "publish") {
          // Publish success: refresh table
          toast.success(t("dashboard.manageShowcases.published"));
          const sp = new URLSearchParams(searchParams);
          sp.set("page", "1");
          sp.set("pageSize", String(pageSize));
          setSearchParams(sp);
        } else if (lastSubmittedAction === "unpublish") {
          // Unpublish success: refresh table
          toast.success(t("dashboard.manageShowcases.unpublished"));
          const sp = new URLSearchParams(searchParams);
          sp.set("page", "1");
          sp.set("pageSize", String(pageSize));
          setSearchParams(sp);
        }
        setLastSubmittedAction(null);
      }
    }
  }, [
    fetcher.state,
    fetcher.data,
    lastSubmittedAction,
    searchParams,
    pageSize,
    setSearchParams,
    t,
    page,
  ]);

  /**
   * Handles search input change and updates URL.
   */
  const handleSearchChange = useCallback(
    (value: string) => {
      const sp = new URLSearchParams(searchParams);
      if (value.trim()) {
        sp.set("search", value);
      } else {
        sp.delete("search");
      }
      sp.set("page", "1");
      sp.set("pageSize", String(pageSize));
      setSearchParams(sp);
    },
    [searchParams, pageSize, setSearchParams],
  );

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      const sp = new URLSearchParams(searchParams);
      // clear existing tags
      sp.delete("tags");
      for (const t of tags) sp.append("tags", t);
      sp.set("page", "1");
      sp.set("pageSize", String(pageSize));
      setSearchParams(sp);
    },
    [searchParams, pageSize, setSearchParams],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t("dashboard.myShowcases.title")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("dashboard.myShowcases.description", { total })}
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("dashboard.myShowcases.addButton")}
        </Button>
      </div>

      {/* Data Table */}
      <ShowcasesDataTable
        columns={showcasesColumns(
          t,
          language,
          handleDelete,
          handlePublish,
          handleUnpublish,
          handleEdit,
        )}
        data={items}
        searchValue={searchParam}
        onSearchChange={handleSearchChange}
        tagsValue={tagsParam}
        onTagsChange={handleTagsChange}
        availableTags={availableTags}
        sortingServer={{
          sortBy,
          sortDir,
          onSortChange: (nextBy, nextDir) => {
            const sp = new URLSearchParams(searchParams);
            sp.set("sortBy", nextBy);
            sp.set("sortDir", nextDir);
            sp.set("page", "1");
            sp.set("pageSize", String(pageSize));
            setSearchParams(sp);
          },
        }}
        pagination={{
          page,
          pageSize,
          total,
          onPrevious: () => {
            const nextPage = Math.max(1, page - 1);
            const sp = new URLSearchParams(searchParams);
            sp.set("page", String(nextPage));
            sp.set("pageSize", String(pageSize));
            setSearchParams(sp);
          },
          onNext: () => {
            const lastPage = Math.max(1, Math.ceil(total / pageSize));
            const nextPage = Math.min(lastPage, page + 1);
            const sp = new URLSearchParams(searchParams);
            sp.set("page", String(nextPage));
            sp.set("pageSize", String(pageSize));
            setSearchParams(sp);
          },
        }}
      />

      {/* Create/Edit Showcase Modal */}
      <ShowcaseModal
        open={isCreateModalOpen || showcaseToEdit !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setShowcaseToEdit(null);
            setServerFieldErrors({});
          }
        }}
        onSubmit={handleCreateSubmit}
        availableTags={availableTags}
        serverFieldErrors={serverFieldErrors}
        mode={showcaseToEdit ? "edit" : "create"}
        showcase={
          showcaseToEdit
            ? {
                id: showcaseToEdit.id,
                name: showcaseToEdit.name,
                description: showcaseToEdit.description,
                url: showcaseToEdit.url,
                image: showcaseToEdit.image,
                publishedAt: showcaseToEdit.publishedAt,
                tags: showcaseToEdit.tags,
              }
            : undefined
        }
      />

      {/* Delete Showcase Confirmation Dialog */}
      <DeleteShowcaseDialog
        open={showcaseToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setShowcaseToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={fetcher.state === "submitting"}
      />
    </div>
  );
};
