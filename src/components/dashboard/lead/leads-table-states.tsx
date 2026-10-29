import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LeadsTableSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="hidden h-4 w-24 sm:block" />
          <Skeleton className="hidden h-4 w-24 md:block" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}

interface LeadsTableErrorProps {
  message?: string;
  onRetry: () => void;
}

export function LeadsTableError({ message, onRetry }: LeadsTableErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">Failed to load leads</p>
        <p className="text-sm text-muted-foreground">
          {message ?? "Something went wrong while fetching leads."}
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RotateCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
