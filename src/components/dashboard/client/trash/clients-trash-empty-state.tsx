import { Trash2, SearchX } from "lucide-react";

interface ClientsTrashEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ClientsTrashEmptyState({
  hasActiveFilters,
  onClearFilters,
}: ClientsTrashEmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">No matching clients</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or status filter.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm font-medium text-primary hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Trash2 className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">Trash is empty</p>
        <p className="text-sm text-muted-foreground">
          Clients you delete will show up here and can be restored anytime.
        </p>
      </div>
    </div>
  );
}
