import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LeadsTrashEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function LeadsTrashEmptyState({
  hasActiveFilters,
  onClearFilters,
}: LeadsTrashEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Trash2 className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">Trash is empty</p>
        <p className="text-sm text-muted-foreground">
          {hasActiveFilters
            ? "No deleted leads match your current filters."
            : "Leads you move to trash will show up here until restored or permanently deleted."}
        </p>
      </div>
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
