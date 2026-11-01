// "use client";

// import type { ColumnDef } from "@tanstack/react-table";
// import type { IClient } from "@/types/clients";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import {
//   MoreHorizontal,
//   Edit2,
//   Eye,
//   Trash2,
//   UserPlus,
//   FileText,
//   Upload,
// } from "lucide-react";
// import { ClientAvatar } from "./client-avatar";
// import { ClientStatusBadge } from "./client-status-badge";
// import { ClientTypeBadge } from "./client-type-badge";
// import {
//   getClientFullName,
//   formatCurrency,
// } from "@/features/clients/utils/client.utils";
// import { format } from "date-fns";

// interface ColumnsConfig {
//   onView?: (client: IClient) => void;
//   onEdit?: (client: IClient) => void;
//   onAssignManager?: (client: IClient) => void;
//   onAddNote?: (client: IClient) => void;
//   onUploadDocument?: (client: IClient) => void;
//   onDelete?: (client: IClient) => void;
// }

// export function getClientsTableColumns(
//   config: ColumnsConfig
// ): ColumnDef<IClient>[] {
//   return [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) =>
//             table.toggleAllPageRowsSelected(!!value)
//           }
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "firstName",
//       header: "Client",
//       cell: ({ row }) => {
//         const client = row.original;
//         console.log("row", client.projects);

//         return (
//           <div className="flex items-center gap-3">
//             <ClientAvatar client={client} size="sm" />
//             <div className="min-w-0">
//               <p className="text-sm font-medium truncate">
//                 {getClientFullName(client)}
//               </p>
//               <p className="text-xs text-muted-foreground truncate">
//                 {client.leadId?.email || client?.email || client?.phone || client.leadId?.phone}
//               </p>
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "companyName",
//       header: "Company",
//       cell: ({ row }) => (
//         <div className="text-sm">
//           {row.original.companyName || "-"}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "phone",
//       header: "Phone",
//       cell: ({ row }) => {
//         const lead = row.original.leadId;
//           const client = row.original;
//         return (
          
//         <div className="text-sm">{client?.phone || lead?.phone || "-"}</div>
//       )
        
//       }
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//       cell: ({ row }) => {
//          const lead = row.original.leadId;
//            const client = row.original;
//         return (
          
//         <div className="text-sm">{client?.email || lead?.email || "-"}</div>
//       )
//       }
//     },
//         {
//       accessorKey: "totalProjects",
//       header: "Projects",
//       cell: ({ row }) => (
//         <div className="text-sm font-medium">
//           {row.original.projects?.length ?? 0}
//         </div>
//       ),
//     },
//     {
//       id: "budget",
//       header: "Budget",
//       cell: ({ row }) => {
//         const totalBudget = (row.original.projects ?? []).reduce(
//           (sum, project) => sum + (project.budget ?? 0),
//           0,
//         );

//         return (
//           <div className="text-sm font-medium">
//             {formatCurrency(totalBudget)}
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "joinedAt",
//       header: "Joined",
//       cell: ({ row }) => (
//         <div className="text-sm">
//           {row.original.joinedAt
//             ? format(
//                 new Date(row.original.joinedAt),
//                 "MMM dd, yyyy"
//               )
//             : "-"}
//         </div>
//       ),
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const client = row.original;

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuSeparator />

//               {config.onView && (
//                 <DropdownMenuItem onClick={() => config.onView?.(client)}>
//                   <Eye className="h-4 w-4 mr-2" />
//                   View Details
//                 </DropdownMenuItem>
//               )}

//               {config.onEdit && (
//                 <DropdownMenuItem onClick={() => config.onEdit?.(client)}>
//                   <Edit2 className="h-4 w-4 mr-2" />
//                   Edit Client
//                 </DropdownMenuItem>
//               )}

//               {config.onAssignManager && (
//                 <DropdownMenuItem
//                   onClick={() => config.onAssignManager?.(client)}
//                 >
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Assign Manager
//                 </DropdownMenuItem>
//               )}

//               {config.onAddNote && (
//                 <DropdownMenuItem onClick={() => config.onAddNote?.(client)}>
//                   <FileText className="h-4 w-4 mr-2" />
//                   Add Note
//                 </DropdownMenuItem>
//               )}

//               {config.onUploadDocument && (
//                 <DropdownMenuItem
//                   onClick={() => config.onUploadDocument?.(client)}
//                 >
//                   <Upload className="h-4 w-4 mr-2" />
//                   Upload Document
//                 </DropdownMenuItem>
//               )}

//               <DropdownMenuSeparator />

//               {config.onDelete && (
//                 <DropdownMenuItem
//                   onClick={() => config.onDelete?.(client)}
//                   className="text-destructive focus:text-destructive"
//                 >
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete Client
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//       enableSorting: false,
//       enableHiding: false,
//     },
//   ];
// }




"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { IClient } from "@/types/clients";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit2,
  Eye,
  Trash2,
  UserPlus,
  FileText,
  Upload,
} from "lucide-react";
import { ClientAvatar } from "./client-avatar";
import {
  getClientFullName,
  formatCurrency,
} from "@/features/clients/utils/client.utils";
import { format } from "date-fns";

interface ColumnsConfig {
  onView?: (client: IClient) => void;
  onEdit?: (client: IClient) => void;
  onAssignManager?: (client: IClient) => void;
  onAddNote?: (client: IClient) => void;
  onUploadDocument?: (client: IClient) => void;
  onDelete?: (client: IClient) => void;
  userRole?:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "MANAGER"
    | "DEVELOPER"
    | "DESIGNER"
    | "MARKETER"
    | "STAFF";
}

// Only these roles may see budget / money data
const FINANCIAL_ROLES = ["SUPER_ADMIN", "ADMIN"];

export function getClientsTableColumns(
  config: ColumnsConfig,
): ColumnDef<IClient>[] {
  const canViewFinancials =
    !!config.userRole && FINANCIAL_ROLES.includes(config.userRole);

  const columns: ColumnDef<IClient>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "firstName",
      header: "Client",
      cell: ({ row }) => {
        const client = row.original;

        return (
          <div className="flex items-center gap-3">
            <ClientAvatar client={client} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {getClientFullName(client)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {client.leadId?.email ||
                  client?.email ||
                  client?.phone ||
                  client.leadId?.phone}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.companyName || "-"}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const lead = row.original.leadId;
        const client = row.original;

        return (
          <div className="text-sm">{client?.phone || lead?.phone || "-"}</div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const lead = row.original.leadId;
        const client = row.original;

        return (
          <div className="text-sm">{client?.email || lead?.email || "-"}</div>
        );
      },
    },
    {
      accessorKey: "totalProjects",
      header: "Projects",
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          {row.original.projects?.length ?? 0}
        </div>
      ),
    },
    {
      id: "budget",
      header: "Budget",
      cell: ({ row }) => {
        const totalBudget = (row.original.projects ?? []).reduce(
          (sum, project) => sum + (project.budget ?? 0),
          0,
        );

        return (
          <div className="text-sm font-medium">
            {formatCurrency(totalBudget)}
          </div>
        );
      },
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.joinedAt
            ? format(new Date(row.original.joinedAt), "MMM dd, yyyy")
            : "-"}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {config.onView && (
                <DropdownMenuItem onClick={() => config.onView?.(client)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}

              {config.onEdit && (
                <DropdownMenuItem onClick={() => config.onEdit?.(client)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Client
                </DropdownMenuItem>
              )}

              {config.onAssignManager && (
                <DropdownMenuItem
                  onClick={() => config.onAssignManager?.(client)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign Manager
                </DropdownMenuItem>
              )}

              {config.onAddNote && (
                <DropdownMenuItem onClick={() => config.onAddNote?.(client)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Add Note
                </DropdownMenuItem>
              )}

              {config.onUploadDocument && (
                <DropdownMenuItem
                  onClick={() => config.onUploadDocument?.(client)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </DropdownMenuItem>
              )}

              {config.onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => config.onDelete?.(client)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Client
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // Hide the budget column for every role except SUPER_ADMIN and ADMIN
  return columns.filter((column) => canViewFinancials || column.id !== "budget");
}