// src/features/projects/components/projects-table-states.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsTableSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

interface ProjectsTableErrorProps {
  message?: string;
  onRetry: () => void;
}

export function ProjectsTableError({ message, onRetry }: ProjectsTableErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm font-medium text-destructive">
        {message ?? "Failed to load projects."}
      </p>
      <Button variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}