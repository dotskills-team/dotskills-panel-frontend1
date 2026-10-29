"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getLeadsTableColumns } from "./leads-table-columns";
import { LeadsEmptyState } from "./leads-empty-state";
import { LeadsTableError, LeadsTableSkeleton } from "./leads-table-states";
import { LeadsColumnVisibility } from "./leads-column-visibility";
import type { ILead, LeadFilters, LeadStatus } from "@/types/lead";

interface LeadsTableProps {
  leads: ILead[];
  isLoading: boolean;
  isError: boolean;
  onUpdateStatus: (lead: ILead, status?: LeadStatus) => void;
  onUpdateContactStatus: (lead: ILead) => void;
  errorMessage?: string;
  hasActiveFilters: boolean;
  sort: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  onAddLead: () => void;
  onRetry: () => void;
  selection: RowSelectionState;
  onSelectionChange: (selection: RowSelectionState) => void;
  onOpenDetails: (lead: ILead) => void;
  onEdit: (lead: ILead) => void;
  onAssign: (lead: ILead) => void;
  onConvert: (lead: ILead) => void;
  onDelete: (lead: ILead) => void;
}

const SORTABLE_COLUMNS = new Set(["lead", "status", "priority", "createdAt"]);
const COLUMN_TO_FIELD: Record<string, string> = {
  lead: "firstName",
  status: "status",
  priority: "priority",
  createdAt: "createdAt",
};

export function LeadsTable({
  leads,
  isLoading,
  isError,
  errorMessage,
  hasActiveFilters,
  sort,
  onSortChange,
  onClearFilters,
  onAddLead,
  onRetry,
  selection,
     onUpdateStatus,
  onUpdateContactStatus,
  onSelectionChange,
  onOpenDetails,
  onEdit,
  onAssign,
  onConvert,
  onDelete,
}: LeadsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = useMemo(
    () =>
      getLeadsTableColumns({ onOpenDetails, onUpdateStatus, onUpdateContactStatus, onEdit, onAssign, onConvert, onDelete }),
    [onOpenDetails, onEdit, onAssign, onConvert, onDelete, onUpdateStatus, onUpdateContactStatus],
  );

  const table = useReactTable({
    data: leads,
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
      <div className="bg-gray-100 dark:bg-slate-950 flex items-center justify-end border-b px-4 py-2">
        <LeadsColumnVisibility table={table} />
      </div>

      {isLoading ? (
        <LeadsTableSkeleton />
      ) : isError ? (
        <LeadsTableError message={errorMessage} onRetry={onRetry} />
      ) : leads.length === 0 ? (
        <LeadsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
          onAddLead={onAddLead}
        />
      ) : (
        <div className="overflow-x-auto bg-gray-100 dark:bg-slate-950">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-cyan-800 *:text-white bg-indigo-600">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                      {header.isPlaceholder ? null : SORTABLE_COLUMNS.has(
                          header.column.id,
                        ) ? (
                        <button
                          type="button"
                          className={cn(
                            "flex items-center gap-1 text-xs font-medium uppercase",
                          )}
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

export type { LeadFilters };
