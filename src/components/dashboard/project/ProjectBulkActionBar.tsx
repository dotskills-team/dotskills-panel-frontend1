// src/features/projects/components/projects-bulk-actions-bar.tsx
"use client";

import { Loader2, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProjectsBulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  isDeleting: boolean;
}

export function ProjectsBulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  isDeleting,
}: ProjectsBulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border-2 border-indigo-100 bg-indigo-50 px-4 py-2.5 dark:border-indigo-900 dark:bg-indigo-950">
      <p className="text-sm font-medium">{selectedCount} project(s) selected</p>
      <div className="flex items-center gap-2">
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          disabled={isDeleting}
          onClick={onBulkDelete}
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          Move to Trash
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClearSelection}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}