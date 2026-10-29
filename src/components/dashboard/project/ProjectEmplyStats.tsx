// src/features/projects/components/projects-empty-state.tsx
"use client";

import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onAddProject: () => void;
}

export function ProjectsEmptyState({
  hasActiveFilters,
  onClearFilters,
  onAddProject,
}: ProjectsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <FolderKanban className="h-10 w-10 text-muted-foreground" />
      <p className="text-sm font-medium">
        {hasActiveFilters ? "No projects match your filters" : "No projects yet"}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {hasActiveFilters
          ? "Try adjusting or clearing your filters to see more results."
          : "Get started by creating your first project."}
      </p>
      {hasActiveFilters ? (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button
          onClick={onAddProject}
          className="gap-2 text-white bg-indigo-600 hover:bg-cyan-800"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      )}
    </div>
  );
}