"use client";

import { RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { IProject } from "@/types/project.types";

interface ProjectTrashRowActionsProps {
  project: IProject;
  onRestore: (project: IProject) => void;
  onPermanentDelete: (project: IProject) => void;
  /** Backend allows permanent delete for SUPER_ADMIN and ADMIN */
  canPermanentDelete?: boolean;
}

// Visible buttons (not a "..." menu) so permanent delete is easy to find
export function ProjectTrashRowActions({
  project,
  onRestore,
  onPermanentDelete,
  canPermanentDelete = true,
}: ProjectTrashRowActionsProps) {
  return (
    <div
      className="flex items-center justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5"
        aria-label={`Restore ${project.name}`}
        onClick={() => onRestore(project)}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Restore</span>
      </Button>

      {canPermanentDelete && (
        <Button
          variant="destructive"
          size="sm"
          className="h-8 gap-1.5"
          aria-label={`Permanently delete ${project.name}`}
          onClick={() => onPermanentDelete(project)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      )}
    </div>
  );
}
