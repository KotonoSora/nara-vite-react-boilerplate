import { Plus } from "lucide-react";
import { useLoaderData, useSearchParams } from "react-router";

import type { FC } from "react";

import type { DashboardContentProps } from "~/features/dashboard/types/type";

import { Button } from "~/components/ui/button";
import { showcasesColumns } from "~/features/dashboard/components/showcases-columns";
import { ShowcasesDataTable } from "~/features/dashboard/components/showcases-data-table";

/**
 * Data table for managing showcases with CRUD operations.
 * Built with TanStack Table and shadcn/ui data-table pattern.
 */
export const ManageShowcase: FC = () => {
  const { showcases } = useLoaderData<DashboardContentProps>();
  const { items, total, page, pageSize } = showcases;
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Handles create new showcase action.
   */
  const handleCreate = () => {
    console.log("Create new showcase");
    // TODO: Implement create functionality
  };

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
    </div>
  );
};
