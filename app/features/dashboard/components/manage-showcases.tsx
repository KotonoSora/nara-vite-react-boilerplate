import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";

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
  const { items, total, page, pageSize } = showcases;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
    try {
      const response = await fetch("/api/showcases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          url: data.url,
          image: data.image ? data.image : undefined,
          publishedAt: data.publishedAt,
          tags: data.tags,
          authorId: user.id,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create showcase";
        try {
          const errorData = (await response.json()) as { error?: string };
          if (typeof errorData.error === "string") {
            errorMessage = errorData.error;
          }
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      // Refresh the data by resetting to page 1
      const sp = new URLSearchParams(searchParams);
      sp.set("page", "1");
      sp.set("pageSize", String(pageSize));
      setSearchParams(sp);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create showcase";
      console.error("Error creating showcase:", message);
      throw new Error(message);
    }
  };

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
      />
    </div>
  );
};
