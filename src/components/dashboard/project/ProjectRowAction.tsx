// // src/features/projects/components/project-row-actions.tsx
// "use client";

// import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import type { IProject } from "@/types/project.types";

// interface ProjectRowActionsProps {
//   project: IProject;
//   onOpenDetails: (project: IProject) => void;
//   onEdit: (project: IProject) => void;
//   onDelete: (project: IProject) => void;
// }

// export function ProjectRowActions({
//   project,
//   onOpenDetails,
//   onEdit,
//   onDelete,
// }: ProjectRowActionsProps) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="h-8 w-8"
//           onClick={(event) => event.stopPropagation()}
//         >
//           <MoreHorizontal className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
//         <DropdownMenuItem onClick={() => onOpenDetails(project)}>
//           <Eye className="h-4 w-4" />
//           View
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => onEdit(project)}>
//           <Pencil className="h-4 w-4" />
//           Edit
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem
//           onClick={() => onDelete(project)}
//           className="text-destructive focus:text-destructive"
//         >
//           <Trash2 className="h-4 w-4" />
//           Move to Trash
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }



"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IProject } from "@/types/project.types";

interface ProjectRowActionsProps {
  project: IProject;
  onOpenDetails: (project: IProject) => void;
  onEdit: (project: IProject) => void;
  onDelete: (project: IProject) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function ProjectRowActions({
  project,
  onOpenDetails,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: ProjectRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
        <DropdownMenuItem onClick={() => onOpenDetails(project)}>
          <Eye className="h-4 w-4" />
          View
        </DropdownMenuItem>

        {canEdit && (
          <DropdownMenuItem onClick={() => onEdit(project)}>
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(project)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Move to Trash
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}