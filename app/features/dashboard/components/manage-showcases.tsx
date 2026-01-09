import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import { toast } from "sonner";

import type { FC } from "react";

import type { DashboardContentProps } from "~/features/dashboard/types/type";

import type { CreateShowcaseFormData } from "./create-showcase-modal";

import { Button } from "~/components/ui/button";

import { CreateShowcaseModal } from "./create-showcase-modal";
import { showcasesColumns } from "./showcases-columns";
import { ShowcasesDataTable } from "./showcases-data-table";

/**
 * Data table for managing showcases with CRUD operations.
 * Built with TanStack Table and shadcn/ui data-table pattern.
 */
export const ManageShowcase: FC = () => {
  const { showcases, availableTags, user } =
    useLoaderData<DashboardContentProps>();
  const fetcher = useFetcher();
  const { items, total, page, pageSize } = showcases;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState<
    Record<string, string>
  >({});
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
   * Handles showcase creation form submission.
   */
  const handleCreateSubmit = async (data: CreateShowcaseFormData) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("description", data.description);
    fd.append("url", data.url);
    if (data.image) fd.append("image", data.image);
    if (data.publishedAt)
      fd.append("publishedAt", data.publishedAt.toISOString());
    for (const t of data.tags) fd.append("tags", t);
    fd.append("authorId", String(user.id));

    fetcher.submit(fd, { method: "post", action: "/action/showcase/new" });

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
        toast.error("Please fix the validation errors");
      } else if (result.error) {
        // Non-field errors: close modal, show toast, refresh table
        toast.error(result.error);
        setIsCreateModalOpen(false);
        setServerFieldErrors({});
        const sp = new URLSearchParams(searchParams);
        sp.set("page", "1");
        sp.set("pageSize", String(pageSize));
        setSearchParams(sp);
      } else if (result.success) {
        // Success: close modal, show toast, table already refreshed optimistically
        toast.success("Showcase created successfully");
        setIsCreateModalOpen(false);
        setServerFieldErrors({});
      }
    }
  }, [fetcher.state, fetcher.data, searchParams, pageSize, setSearchParams]);

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
          <h2 className="text-2xl font-bold tracking-tight">My Showcases</h2>
          <p className="text-muted-foreground text-sm">
            Manage your showcase portfolio ({total} total)
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Showcase
        </Button>
      </div>

      {/* Data Table */}
      <ShowcasesDataTable
        columns={showcasesColumns}
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

      {/* Create Showcase Modal */}
      <CreateShowcaseModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateSubmit}
        availableTags={availableTags}
        serverFieldErrors={serverFieldErrors}
      />
    </div>
  );
};
