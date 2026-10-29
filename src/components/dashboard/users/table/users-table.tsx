// "use client";

// import { useMemo, useState } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   flexRender,
//   ColumnDef,
//   VisibilityState,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronLeft, ChevronRight, Settings2, Users } from "lucide-react";
// import type { User } from "@/types/user.types";

// interface UsersTableProps {
//   data: User[];
//   columns: ColumnDef<User>[];
//   isLoading?: boolean;
//   pageCount?: number;
//   currentPage?: number;
//   onPageChange?: (page: number) => void;
//   pageSize?: number;
//   onPageSizeChange?: (size: number) => void;
//   isSelectable?: boolean;
//   onSelectionChange?: (selected: User[]) => void;
// }

// export function UsersTable({
//   data,
//   columns,
//   isLoading,
//   pageCount,
//   currentPage = 1,
//   onPageChange,
//   pageSize = 10,
//   onSelectionChange,
// }: UsersTableProps) {
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: { columnVisibility, rowSelection },
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     manualPagination: Boolean(pageCount),
//     rowCount: pageCount ? pageCount * pageSize : undefined,
//   });

//   const selectedRows = useMemo(
//     () => table.getSelectedRowModel().rows.map((row) => row.original),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [table, rowSelection],
//   );

//   useMemo(() => {
//     onSelectionChange?.(selectedRows);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedRows]);

//   return (
//     <div className="space-y-4 bg-gray-100 dark:bg-slate-950">
//       <div className="flex items-center justify-between">
//         <div className="text-sm text-[var(--muted-fg)]">
//           {selectedRows.length > 0 ? (
//             <span className="font-medium text-[var(--brand-cobalt)]">
//               {selectedRows.length} selected
//             </span>
//           ) : (
//             <span>{data.length} {data.length === 1 ? "user" : "users"} on this page</span>
//           )}
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" size="sm" className="gap-2">
//               <Settings2 className="h-3.5 w-3.5" />
//               Columns
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-[200px]">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => (
//                 <DropdownMenuCheckboxItem
//                   key={column.id}
//                   className="capitalize"
//                   checked={column.getIsVisible()}
//                   onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                 >
//                   {column.id}
//                 </DropdownMenuCheckboxItem>
//               ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-slate-950">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow
//                 key={headerGroup.id}
//                 className="border-[var(--border)] hover:bg-transparent"
//               >
//                 {headerGroup.headers.map((header) => (
//                   <TableHead
//                     key={header.id}
//                     className="h-11 text-xs font-medium uppercase tracking-wide text-[var(--muted-fg)]"
//                   >
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(header.column.columnDef.header, header.getContext())}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               Array.from({ length: pageSize }).map((_, idx) => (
//                 <TableRow key={`skeleton-${idx}`} className="border-[var(--border)]">
//                   {columns.map((_, colIdx) => (
//                     <TableCell key={`skeleton-cell-${colIdx}`}>
//                       <div className="h-4 w-full max-w-32 animate-pulse rounded bg-[var(--muted)]" />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : table.getRowModel().rows.length === 0 ? (
//               <TableRow className="hover:bg-transparent">
//                 <TableCell colSpan={columns.length} className="h-56">
//                   <div className="flex flex-col items-center justify-center gap-2 text-center">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
//                       <Users className="h-5 w-5 text-[var(--muted-fg)]" />
//                     </div>
//                     <p className="text-sm font-medium text-[var(--foreground)]">
//                       No users found
//                     </p>
//                     <p className="text-xs text-[var(--muted-fg)]">
//                       Try adjusting your filters, or invite someone new.
//                     </p>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                   className="border-[var(--border)] transition-colors hover:bg-[var(--muted)]/60 data-[state=selected]:bg-[var(--brand-cobalt-soft)]"
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id} className="py-3">
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {pageCount ? (
//         <div className="flex items-center justify-between gap-2">
//           <div className="text-sm text-[var(--muted-fg)]">
//             Page <span className="font-medium text-[var(--foreground)]">{currentPage}</span> of{" "}
//             {pageCount}
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={currentPage === 1}
//               onClick={() => onPageChange?.(currentPage - 1)}
//               className="gap-1"
//             >
//               <ChevronLeft className="h-4 w-4" />
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={currentPage === pageCount}
//               onClick={() => onPageChange?.(currentPage + 1)}
//               className="gap-1"
//             >
//               Next
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Settings2, Users } from "lucide-react";
import type { User } from "@/types/user.types";

interface UsersTableProps {
  data: User[];
  columns: ColumnDef<User>[];
  isLoading?: boolean;
  pageCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  isSelectable?: boolean;
  onSelectionChange?: (selected: User[]) => void;
}

export function UsersTable({
  data,
  columns,
  isLoading,
  pageCount,
  currentPage = 1,
  onPageChange,
  pageSize = 10,
  onSelectionChange,
}: UsersTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row._id,
    state: { columnVisibility, rowSelection },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: Boolean(pageCount),
    rowCount: pageCount ? pageCount * pageSize : undefined,
  });

  const selectedRows = useMemo(
    () => table.getSelectedRowModel().rows.map((row) => row.original),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, rowSelection, data],
  );

  // Notify the parent AFTER render (effects run post-render, so no setState-in-render error)
  useEffect(() => {
    onSelectionChange?.(selectedRows);
  }, [selectedRows, onSelectionChange]);

  return (
    <div className="space-y-4 bg-gray-100 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--muted-fg)]">
          {selectedRows.length > 0 ? (
            <span className="font-medium text-[var(--brand-cobalt)]">
              {selectedRows.length} selected
            </span>
          ) : (
            <span>{data.length} {data.length === 1 ? "user" : "users"} on this page</span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings2 className="h-3.5 w-3.5" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-slate-950">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-[var(--border)] hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 text-xs font-medium uppercase tracking-wide text-[var(--muted-fg)]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="border-[var(--border)]">
                  {columns.map((_, colIdx) => (
                    <TableCell key={`skeleton-cell-${colIdx}`}>
                      <div className="h-4 w-full max-w-32 animate-pulse rounded bg-[var(--muted)]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-56">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
                      <Users className="h-5 w-5 text-[var(--muted-fg)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      No users found
                    </p>
                    <p className="text-xs text-[var(--muted-fg)]">
                      Try adjusting your filters, or invite someone new.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-[var(--border)] transition-colors hover:bg-[var(--muted)]/60 data-[state=selected]:bg-[var(--brand-cobalt-soft)]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount ? (
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-[var(--muted-fg)]">
            Page <span className="font-medium text-[var(--foreground)]">{currentPage}</span> of{" "}
            {pageCount}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === pageCount}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}