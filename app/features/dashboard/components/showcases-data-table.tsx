import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

interface ServerPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

type SortKey = "name" | "createdAt" | "publishedAt";

interface ServerSortingProps {
  sortBy: SortKey;
  sortDir: "asc" | "desc";
  onSortChange: (sortBy: SortKey, sortDir: "asc" | "desc") => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  tagsValue?: string[];
  onTagsChange?: (tags: string[]) => void;
  availableTags?: string[];
  pagination?: ServerPaginationProps;
  sortingServer?: ServerSortingProps;
}

/**
 * Reusable data table component with sorting, filtering, pagination, and row selection.
 * Built with TanStack Table and shadcn/ui components.
 */
export function ShowcasesDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  sortingServer,
  searchValue,
  onSearchChange,
  tagsValue,
  onTagsChange,
  availableTags,
}: DataTableProps<TData, TValue>) {
  const t = useTranslation();
  const initialSorting = React.useMemo<SortingState>(() => {
    if (!sortingServer) return [];
    return [
      {
        id: sortingServer.sortBy,
        desc: sortingServer.sortDir === "desc",
      },
    ];
  }, [sortingServer?.sortBy, sortingServer?.sortDir]);

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  React.useEffect(() => {
    setSorting(initialSorting);
  }, [initialSorting]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const allTags = React.useMemo(() => {
    if (availableTags && availableTags.length) return availableTags;
    const set = new Set<string>();
    for (const item of data as unknown as Array<{ tags?: unknown }>) {
      const tags = (item?.tags as string[] | undefined) || [];
      for (const t of tags) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [availableTags, data]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      if (sortingServer) {
        const first = next[0];
        if (
          first &&
          (first.id === "name" ||
            first.id === "createdAt" ||
            first.id === "publishedAt")
        ) {
          sortingServer.onSortChange(
            first.id as SortKey,
            first.desc ? "desc" : "asc",
          );
        }
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder={t("dashboard.showcasesTable.filterPlaceholder")}
          value={
            searchValue !== undefined
              ? searchValue
              : ((table.getColumn("name")?.getFilterValue() as string) ?? "")
          }
          onChange={(event) =>
            onSearchChange
              ? onSearchChange(event.target.value)
              : table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={false}
                aria-label={t("dashboard.showcasesTable.selectTags")}
              >
                {t("dashboard.showcasesTable.tags")}
                {tagsValue && tagsValue.length ? ` (${tagsValue.length})` : ""}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-0">
              <Command>
                <CommandInput
                  placeholder={t("dashboard.showcasesTable.searchTags")}
                />
                <CommandList>
                  <CommandEmpty>
                    {t("dashboard.showcasesTable.noTags")}
                  </CommandEmpty>
                  <CommandGroup>
                    {allTags.length
                      ? allTags.map((tag) => {
                          const checked = !!tagsValue?.includes(tag);
                          return (
                            <CommandItem
                              key={tag}
                              onSelect={() => {
                                if (!onTagsChange) return;
                                const next = new Set(tagsValue ?? []);
                                if (next.has(tag)) next.delete(tag);
                                else next.add(tag);
                                onTagsChange(Array.from(next));
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${checked ? "opacity-100" : "opacity-0"}`}
                              />
                              {tag}
                            </CommandItem>
                          );
                        })
                      : null}
                  </CommandGroup>
                </CommandList>
              </Command>
              {onTagsChange && tagsValue && tagsValue.length > 0 ? (
                <div className="border-t p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTagsChange([])}
                    className="w-full"
                  >
                    {t("dashboard.showcasesTable.clearTags")}
                  </Button>
                </div>
              ) : null}
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t("dashboard.showcasesTable.columns")}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-muted-foreground">
                    {t("dashboard.showcasesTable.empty")}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {t("dashboard.showcasesTable.selected", {
            selected: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>
        <div className="flex items-center space-x-2">
          {pagination ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.onPrevious}
                disabled={pagination.page <= 1}
              >
                {t("dashboard.showcasesTable.previous")}
              </Button>
              <div className="text-sm text-muted-foreground">
                {t("dashboard.showcasesTable.pageOf", {
                  page: pagination.page,
                  totalPages: Math.max(
                    1,
                    Math.ceil(pagination.total / pagination.pageSize),
                  ),
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.onNext}
                disabled={
                  pagination.page * pagination.pageSize >= pagination.total
                }
              >
                {t("dashboard.showcasesTable.next")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {t("dashboard.showcasesTable.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {t("dashboard.showcasesTable.next")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
