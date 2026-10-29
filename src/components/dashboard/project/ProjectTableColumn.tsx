// // src/features/projects/components/project-table-columns.tsx
// "use client";

// import type { ColumnDef } from "@tanstack/react-table";

// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";

// import type { IProject } from "@/types/project.types";
// import { PROJECT_STATUS_CONFIG, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
// import { formatCurrency, formatDate } from "@/features/project/utils/project.utils";
// import { ProjectRowActions } from "./ProjectRowAction";

// const TYPE_LABELS = Object.fromEntries(
//   PROJECT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
// );

// interface ProjectsTableColumnsOptions {
//   onOpenDetails: (project: IProject) => void;
//   onEdit: (project: IProject) => void;
//   onDelete: (project: IProject) => void;
// }

// export function getProjectsTableColumns({
//   onOpenDetails,
//   onEdit,
//   onDelete,
// }: ProjectsTableColumnsOptions): ColumnDef<IProject>[] {
//   return [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
//           onClick={(event) => event.stopPropagation()}
//           aria-label="Select row"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//       size: 40,
//     },
//     {
//       accessorKey: "name",
//       id: "name",
//       header: "Project",
//       cell: ({ row }) => {
//         const project = row.original;
//         return (
//           <button
//             type="button"
//             onClick={() => onOpenDetails(project)}
//             className="flex flex-col text-left"
//           >
//             <span className="font-medium">{project.name}</span>
//             <span className="text-xs text-muted-foreground">{project.client?.fullName}</span>
//           </button>
//         );
//       },
//       enableHiding: false,
//     },
//     {
//       accessorKey: "type",
//       header: "Type",
//       cell: ({ row }) => (
//         <span className="text-sm text-muted-foreground">
//           {TYPE_LABELS[row.original.type] ?? row.original.type}
//         </span>
//       ),
//     },
//     // {
//     //   accessorKey: "status",
//     //   header: "Status",
//     //   cell: ({ row }) => {
//     //     const config = PROJECT_STATUS_CONFIG[row.original.status];
//     //     return (
//     //       <Badge variant="outline" className={config.className}>
//     //         {config.label}
//     //       </Badge>
//     //     );
//     //   },
//     // },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const status = row.original.status;
//         const config = PROJECT_STATUS_CONFIG[status];

//         const label =
//           config?.label ??
//           status
//             ?.toLowerCase()
//             .replace(/_/g, " ")
//             .replace(/\b\w/g, (char) => char.toUpperCase()) ??
//           "Unknown";

//         return (
//           <Badge
//             variant="outline"
//             className={config?.className ?? "text-muted-foreground"}
//           >
//             {label}
//           </Badge>
//         );
//       },
//     },
//     {
//       accessorKey: "budget",
//       header: "Project Value",
//       cell: ({ row }) => (
//         <span className="text-sm text-muted-foreground">
//           {formatCurrency(row.original.budget)}
//         </span>
//       ),
//     },
//     {
//       id: "dueAmount",
//       header: "Due Amount",
//       cell: ({ row }) => {
//         const project = row.original;
//         const totalPaid = (project.payments ?? [])
//           .filter((p) => p.status === "COMPLETE")
//           .reduce((sum, p) => sum + (p.amount || 0), 0);
//         const amountDue =
//           project.budget !== undefined && project.budget !== null
//             ? Math.max(project.budget - totalPaid, 0)
//             : undefined;

//         return (
//           <span className={`text-sm font-medium ${amountDue === 0 ? "text-green-500":" text-red-600 dark:text-red-400"} `}>
//             {amountDue !== undefined ? formatCurrency(amountDue) : "—"}
//           </span>
//         );
//       },
//     },
//     {
//       accessorKey: "startDate",
//       id: "startDate",
//       header: "Start Date",
//       cell: ({ row }) => (
//         <span className="text-sm text-muted-foreground">
//           {formatDate(row.original.startDate)}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "updatedAt",
//       header: "Delivery Date",
//       cell: ({ row }) => (
//         <span className="text-sm text-muted-foreground">
//           {formatDate(row.original.endDate)}
//         </span>
//       ),
//     },
//     // {
//     //   accessorKey: "technologies",
//     //   header: "Technologies",
//     //   cell: ({ row }) => {
//     //     const technologies = row.original.technologies ?? [];
//     //     return (
//     //       <div className="flex max-w-50 flex-wrap gap-1">
//     //         {technologies.slice(0, 3).map((tech) => (
//     //           <Badge key={tech} variant="outline">
//     //             {tech}
//     //           </Badge>
//     //         ))}
//     //         {technologies.length > 3 && (
//     //           <Badge variant="outline">+{technologies.length - 3}</Badge>
//     //         )}
//     //       </div>
//     //     );
//     //   },
//     // },

//     {
//       id: "actions",
//       header: "Actions",
//       enableHiding: false,
//       enableSorting: false,
//       cell: ({ row }) => (
//         <ProjectRowActions
//           project={row.original}
//           onOpenDetails={onOpenDetails}
//           onEdit={onEdit}
//           onDelete={onDelete}
//         />
//       ),
//     },
//   ];
// }



"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import type { IProject } from "@/types/project.types";
import { PROJECT_STATUS_CONFIG, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
import { formatCurrency, formatDate } from "@/features/project/utils/project.utils";
import { ProjectRowActions } from "./ProjectRowAction";
import { ProjectPermissions } from "@/features/project/utils/project.permission";

const TYPE_LABELS = Object.fromEntries(
  PROJECT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

// Column ids that contain money data
const FINANCIAL_COLUMN_IDS = ["budget", "dueAmount"];

interface ProjectsTableColumnsOptions {
  onOpenDetails: (project: IProject) => void;
  onEdit: (project: IProject) => void;
  onDelete: (project: IProject) => void;
  permissions: ProjectPermissions;
}

export function getProjectsTableColumns({
  onOpenDetails,
  onEdit,
  onDelete,
  permissions,
}: ProjectsTableColumnsOptions): ColumnDef<IProject>[] {
  const columns: ColumnDef<IProject>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          onClick={(event) => event.stopPropagation()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "name",
      id: "name",
      header: "Project",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="flex flex-col text-left"
          >
            <span className="font-medium">{project.name}</span>
            <span className="text-xs text-muted-foreground">{project.client?.fullName}</span>
          </button>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {TYPE_LABELS[row.original.type] ?? row.original.type}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const config = PROJECT_STATUS_CONFIG[status];

        const label =
          config?.label ??
          status
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()) ??
          "Unknown";

        return (
          <Badge
            variant="outline"
            className={config?.className ?? "text-muted-foreground"}
          >
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "budget",
      id: "budget",
      header: "Project Value",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatCurrency(row.original.budget)}
        </span>
      ),
    },
    {
      id: "dueAmount",
      header: "Due Amount",
      cell: ({ row }) => {
        const project = row.original;
        const totalPaid = (project.payments ?? [])
          .filter((p) => p.status === "COMPLETE")
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        const amountDue =
          project.budget !== undefined && project.budget !== null
            ? Math.max(project.budget - totalPaid, 0)
            : undefined;

        return (
          <span
            className={`text-sm font-medium ${
              amountDue === 0 ? "text-green-500" : "text-red-600 dark:text-red-400"
            }`}
          >
            {amountDue !== undefined ? formatCurrency(amountDue) : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "startDate",
      id: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.startDate)}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      id: "updatedAt",
      header: "Delivery Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.endDate)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <ProjectRowActions
          project={row.original}
          onOpenDetails={onOpenDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={permissions.canEdit}
          canDelete={permissions.canDelete}
        />
      ),
    },
  ];

  // Remove columns the current role must not see
  return columns.filter((column) => {
    const id = column.id ?? (column as { accessorKey?: string }).accessorKey;

    if (!permissions.canViewFinancials && id && FINANCIAL_COLUMN_IDS.includes(id)) {
      return false;
    }

    // Checkbox column exists only for bulk delete
    if (!permissions.canDelete && id === "select") {
      return false;
    }

    return true;
  });
}