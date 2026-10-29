/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { IClient } from "@/types/clients";
import { useState } from "react";
import { getClientsTableColumns } from "./clients-table-columns";

interface ClientsTableProps {
  clients: IClient[];
  isLoading?: boolean;
  onView?: (client: IClient) => void;
  onEdit?: (client: IClient) => void;
  onAssignManager?: (client: IClient) => void;
  onAddNote?: (client: IClient) => void;
  onUploadDocument?: (client: IClient) => void;
  onDelete?: (client: IClient) => void;
}

export function ClientsTable({
  clients,
  isLoading,
  onView,
  onEdit,
  onAssignManager,
  onAddNote,
  onUploadDocument,
  onDelete,
}: ClientsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<any>({});

  const columns = getClientsTableColumns({
    onView,
    onEdit,
    onAssignManager,
    onAddNote,
    onUploadDocument,
    onDelete,
  });

  const table = useReactTable({
    data: clients,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-cyan-800 *:text-white bg-indigo-600">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="h-12">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No clients found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
