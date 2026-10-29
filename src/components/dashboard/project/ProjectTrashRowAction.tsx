// // src/features/projects/components/project-trash-row-actions.tsx
// "use client";

// import { MoreHorizontal, RotateCcw } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import type { IProject } from "@/types/project.types";

// interface ProjectTrashRowActionsProps {
//   project: IProject;
//   onRestore: (project: IProject) => void;
// }

// export function ProjectTrashRowActions({ project, onRestore }: ProjectTrashRowActionsProps) {
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
//         <DropdownMenuItem onClick={() => onRestore(project)}>
//           <RotateCcw className="h-4 w-4" />
//           Restore
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

"use client";

import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IProject } from "@/types/project.types";

interface ProjectTrashRowActionsProps {
  project: IProject;
  onRestore: (project: IProject) => void;
  onPermanentDelete: (project: IProject) => void;
  canPermanentDelete?: boolean;
}

export function ProjectTrashRowActions({
  project,
  onRestore,
  onPermanentDelete,
  canPermanentDelete = true,
}: ProjectTrashRowActionsProps) {
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
        <DropdownMenuItem onClick={() => onRestore(project)}>
          <RotateCcw className="h-4 w-4" />
          Restore
        </DropdownMenuItem>

        {canPermanentDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onPermanentDelete(project)}
            >
              <Trash2 className="h-4 w-4" />
              Delete permanently
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}