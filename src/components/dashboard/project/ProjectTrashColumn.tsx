// // src/features/projects/components/project-trash-table-columns.tsx
// "use client";

// import type { ColumnDef } from "@tanstack/react-table";

// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import type { IProject } from "@/types/project.types";
// import { PROJECT_STATUS_CONFIG, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
// import { getUserFullName } from "@/features/users/utils/user.utils";
// import { formatDate } from "@/features/project/utils/project.utils";
// import { ProjectTrashRowActions } from "./ProjectTrashRowAction";

// const TYPE_LABELS = Object.fromEntries(
//   PROJECT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
// );

// interface ProjectTrashTableColumnsOptions {
//   onRestore: (project: IProject) => void;
// }

// export function getProjectTrashTableColumns({
//   onRestore,
// }: ProjectTrashTableColumnsOptions): ColumnDef<IProject>[] {
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
//           <div className="flex flex-col">
//             <span className="font-medium">{project.name}</span>
//             <span className="text-xs text-muted-foreground">
//               {getUserFullName(project.client)}
//             </span>
//           </div>
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
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const config = PROJECT_STATUS_CONFIG[row.original.status];
//         return (
//           <Badge variant="outline" className={config.className}>
//             {config.label}
//           </Badge>
//         );
//       },
//     },
//     {
//       accessorKey: "deletedAt",
//       id: "deletedAt",
//       header: "Deleted At",
//       cell: ({ row }) => (
//         <span className="text-sm text-muted-foreground">
//           {formatDate(row.original.deletedAt)}
//         </span>
//       ),
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       enableHiding: false,
//       enableSorting: false,
//       cell: ({ row }) => (
//         <ProjectTrashRowActions project={row.original} onRestore={onRestore} />
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
import { getUserFullName } from "@/features/users/utils/user.utils";
import { formatDate } from "@/features/project/utils/project.utils";
import { ProjectTrashRowActions } from "./ProjectTrashRowAction";

const TYPE_LABELS = Object.fromEntries(
  PROJECT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

interface ProjectTrashTableColumnsOptions {
  onRestore: (project: IProject) => void;
  onPermanentDelete: (project: IProject) => void;
  canPermanentDelete?: boolean;
}

export function getProjectTrashTableColumns({
  onRestore,
  onPermanentDelete,
  canPermanentDelete = true,
}: ProjectTrashTableColumnsOptions): ColumnDef<IProject>[] {
  return [
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
          <div className="flex flex-col">
            <span className="font-medium">{project.name}</span>
            <span className="text-xs text-muted-foreground">
              {getUserFullName(project.client)}
            </span>
          </div>
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
        const config = PROJECT_STATUS_CONFIG[row.original.status];
        return (
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "deletedAt",
      id: "deletedAt",
      header: "Deleted At",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.deletedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <ProjectTrashRowActions
          project={row.original}
          onRestore={onRestore}
          onPermanentDelete={onPermanentDelete}
          canPermanentDelete={canPermanentDelete}
        />
      ),
    },
  ];
}