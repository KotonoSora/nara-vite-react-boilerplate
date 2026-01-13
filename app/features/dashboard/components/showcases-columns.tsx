import { formatDate } from "@kotonosora/i18n";
import { type useTranslation } from "@kotonosora/i18n-react";
import {
  ArrowUpDown,
  Edit,
  ExternalLink,
  FileX,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react";

import type { SupportedLanguage } from "@kotonosora/i18n-locales";
import type { ColumnDef } from "@tanstack/react-table";

import type { ShowcaseItem } from "~/features/landing-page/utils/fetch-showcases";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

/**
 * Column definitions for showcases data table.
 */
export const showcasesColumns = (
  t: ReturnType<typeof useTranslation>,
  language: SupportedLanguage,
  onDelete?: (showcaseId: string) => void,
  onPublish?: (showcaseId: string) => void,
  onUnpublish?: (showcaseId: string) => void,
  onEdit?: (showcaseId: string) => void,
): ColumnDef<ShowcaseItem>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t("dashboard.showcasesTable.selectAll")}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t("dashboard.showcasesTable.selectRow")}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("dashboard.showcasesTable.name")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const showcase = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{showcase.name}</span>
          {showcase.url && (
            <a
              href={showcase.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: t("dashboard.showcasesTable.description"),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-75 truncate" title={description}>
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    header: t("dashboard.showcasesTable.tags"),
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.length > 0 ? (
            <>
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  {t("dashboard.showcasesTable.moreTags", {
                    count: tags.length - 3,
                  })}
                </Badge>
              )}
            </>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("dashboard.showcasesTable.status")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("publishedAt") as Date | undefined;
      const isPublished = !!date;
      return (
        <div className="flex flex-col items-center justify-start gap-2">
          <Badge
            variant={isPublished ? "default" : "secondary"}
            className="text-xs"
          >
            {isPublished
              ? t("dashboard.showcasesTable.published")
              : t("dashboard.showcasesTable.draft")}
          </Badge>
          {isPublished && (
            <span className="text-muted-foreground text-xs">
              {formatDate(date, language)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("dashboard.showcasesTable.created")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date | undefined;
      return (
        <div className="text-muted-foreground text-xs">
          {date && formatDate(date, language)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const showcase = row.original;
      const isPublished = !!showcase.publishedAt;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">
                {t("dashboard.showcasesTable.openMenu")}
              </span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {t("dashboard.showcasesTable.actions")}
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit?.(showcase.id)}>
              <Edit className="mr-2 h-4 w-4" />
              {t("dashboard.showcasesTable.edit")}
            </DropdownMenuItem>
            {!isPublished ? (
              <DropdownMenuItem onClick={() => onPublish?.(showcase.id)}>
                <Send className="mr-2 h-4 w-4" />
                {t("dashboard.showcasesTable.publish")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onUnpublish?.(showcase.id)}>
                <FileX className="mr-2 h-4 w-4" />
                {t("dashboard.showcasesTable.unpublish")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete?.(showcase.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("dashboard.showcasesTable.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
