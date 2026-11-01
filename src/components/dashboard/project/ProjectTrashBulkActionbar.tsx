"use client";

import { Loader2, RotateCcw, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProjectsTrashBulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkRestore: () => void;
  isRestoring: boolean;
  /** Shown only when the user may permanently delete (SUPER_ADMIN, ADMIN) */
  onBulkPermanentDelete?: () => void;
  isDeleting?: boolean;
}

export function ProjectsTrashBulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkRestore,
  isRestoring,
  onBulkPermanentDelete,
  isDeleting = false,
}: ProjectsTrashBulkActionsBarProps) {
  if (selectedCount === 0) return null;

  const isBusy = isRestoring || isDeleting;

  return (
    <div className="flex flex-col gap-2 rounded-lg border-2 border-indigo-100 bg-indigo-50 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between dark:border-indigo-900 dark:bg-indigo-950">
      <p className="text-sm font-medium">{selectedCount} project(s) selected</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="gap-2 bg-indigo-600 text-white hover:bg-cyan-800"
          disabled={isBusy}
          onClick={onBulkRestore}
        >
          {isRestoring ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          Restore Selected
        </Button>

        {onBulkPermanentDelete && (
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            disabled={isBusy}
            onClick={onBulkPermanentDelete}
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete Selected
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Clear selection"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
