// src/features/projects/components/projects-table.tsx
"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { IProject } from "@/types/project.types";
import { getProjectsTableColumns } from "./ProjectTableColumn";
import { ProjectsTableError, ProjectsTableSkeleton } from "./ProjectTableSkeleton";
import { ProjectsEmptyState } from "./ProjectEmplyStats";
import { ProjectPermissions } from "@/features/project/utils/project.permission";

interface ProjectsTableProps {
  projects: IProject[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  hasActiveFilters: boolean;
  sort: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  onAddProject: () => void;
  onRetry: () => void;
  selection: RowSelectionState;
  onSelectionChange: (selection: RowSelectionState) => void;
  onOpenDetails: (project: IProject) => void;
  onEdit: (project: IProject) => void;
  onDelete: (project: IProject) => void;
  permissions: ProjectPermissions;

}

const SORTABLE_COLUMNS = new Set(["name", "status", "startDate"]);
const COLUMN_TO_FIELD: Record<string, string> = {
  name: "name",
  status: "status",
  startDate: "startDate",
};

export function ProjectsTable({
  projects,
  isLoading,
  isError,
  errorMessage,
  hasActiveFilters,
  sort,
  permissions,
  onSortChange,
  onClearFilters,
  onAddProject,
  onRetry,
  selection,
  onSelectionChange,
  onOpenDetails,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // const columns = useMemo(
  //   () => getProjectsTableColumns({ onOpenDetails, onEdit, onDelete }),
  //   [onOpenDetails, onEdit, onDelete],
  // );

  const columns = useMemo(
    () => getProjectsTableColumns({ onOpenDetails, onEdit, onDelete, permissions }),
    [onOpenDetails, onEdit, onDelete, permissions],
  );

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
    state: {
      rowSelection: selection,
      columnVisibility,
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(selection) : updater;
      onSelectionChange(next);
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
  });

  const handleSortClick = (columnId: string) => {
    const field = COLUMN_TO_FIELD[columnId];
    if (!field) return;

    const isDesc = sort === `-${field}`;
    const isAsc = sort === field;

    if (isAsc) {
      onSortChange(`-${field}`);
    } else if (isDesc) {
      onSortChange("-createdAt");
    } else {
      onSortChange(field);
    }
  };

  const getSortIcon = (columnId: string) => {
    const field = COLUMN_TO_FIELD[columnId];
    if (!field) return null;

    if (sort === field) return <ArrowUp className="h-3.5 w-3.5" />;
    if (sort === `-${field}`) return <ArrowDown className="h-3.5 w-3.5" />;
    return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
  };

  return (
    <div className="rounded-lg border-2 border-slate-100 dark:border-slate-900">
      <div className="flex items-center justify-end border-b bg-gray-100 px-4 py-2 dark:bg-slate-950">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                  onSelect={(event) => event.preventDefault()}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <ProjectsTableSkeleton />
      ) : isError ? (
        <ProjectsTableError message={errorMessage} onRetry={onRetry} />
      ) : projects.length === 0 ? (
        <ProjectsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
          onAddProject={onAddProject}
        />
      ) : (
        <div className="overflow-x-auto bg-gray-100 dark:bg-slate-950">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-indigo-600 *:text-white hover:bg-cyan-800"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                      {header.isPlaceholder ? null : SORTABLE_COLUMNS.has(
                        header.column.id,
                      ) ? (
                        <button
                          type="button"
                          className={cn("flex items-center gap-1 text-xs font-medium uppercase")}
                          onClick={() => handleSortClick(header.column.id)}
                        >
                          {header.column.columnDef.header as string}
                          {getSortIcon(header.column.id)}
                        </button>
                      ) : (
                        <span className="text-xs font-medium uppercase">
                          {typeof header.column.columnDef.header === "string"
                            ? header.column.columnDef.header
                            : null}
                        </span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => onOpenDetails(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}