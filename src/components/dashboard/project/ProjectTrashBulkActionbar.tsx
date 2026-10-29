// src/features/projects/components/projects-trash-bulk-actions-bar.tsx
"use client";

import { Loader2, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProjectsTrashBulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkRestore: () => void;
  isRestoring: boolean;
}

export function ProjectsTrashBulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkRestore,
  isRestoring,
}: ProjectsTrashBulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border-2 border-indigo-100 bg-indigo-50 px-4 py-2.5 dark:border-indigo-900 dark:bg-indigo-950">
      <p className="text-sm font-medium">{selectedCount} project(s) selected</p>
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="gap-2 bg-indigo-600 text-white hover:bg-cyan-800"
          disabled={isRestoring}
          onClick={onBulkRestore}
        >
          {isRestoring ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          Restore Selected
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClearSelection}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}