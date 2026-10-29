// src/features/projects/components/projects-trash-empty-state.tsx
"use client";

import { Trash2 } from "lucide-react";

interface ProjectsTrashEmptyStateProps {
  hasActiveFilters: boolean;
}

export function ProjectsTrashEmptyState({ hasActiveFilters }: ProjectsTrashEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Trash2 className="h-10 w-10 text-muted-foreground" />
      <p className="text-sm font-medium">
        {hasActiveFilters ? "No trashed projects match your filters" : "Trash is empty"}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Projects moved to trash will show up here and can be restored anytime.
      </p>
    </div>
  );
}