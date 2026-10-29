import { UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LeadsEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onAddLead: () => void;
}

export function LeadsEmptyState({
  hasActiveFilters,
  onClearFilters,
  onAddLead,
}: LeadsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">No leads found</p>
        <p className="text-sm text-muted-foreground">
          {hasActiveFilters
            ? "Try adjusting or clearing your filters to see more results."
            : "Get started by adding your first lead."}
        </p>
      </div>
      {hasActiveFilters ? (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button onClick={onAddLead}>
          <UserPlus className="h-4 w-4" />
          Add Lead
        </Button>
      )}
    </div>
  );
}
