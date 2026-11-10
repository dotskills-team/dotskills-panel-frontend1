"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatPercent, KPI_STATUS_LABEL, progressValue } from "@/features/kpi/utils/kpi.utils";
import type { KpiReportStatus, KpiStatus } from "@/types/kpi.types";

const STATUS_STYLE: Record<KpiStatus, string> = {
  draft: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  closed: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function KpiStatusBadge({ status }: { status: KpiStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATUS_STYLE[status])}>
      {KPI_STATUS_LABEL[status]}
    </Badge>
  );
}

export function KpiReportBadge({
  status,
  isLate,
}: {
  status: KpiReportStatus | "none" | undefined;
  isLate?: boolean;
}) {
  if (!status) return <span className="text-muted-foreground">—</span>;

  if (status === "none") {
    return (
      <Badge variant="outline" className="font-medium text-muted-foreground">
        Not submitted
      </Badge>
    );
  }

  if (status === "draft") {
    return (
      <Badge variant="outline" className="font-medium text-amber-700 dark:text-amber-300">
        Draft
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
      >
        {status === "reviewed" ? "Reviewed" : "Submitted"}
      </Badge>
      {isLate && (
        <Badge variant="outline" className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400">
          Late
        </Badge>
      )}
    </div>
  );
}

/** Percentage with a bar. The bar is capped at 100% but the number shows the real value. */
export function PercentBar({
  value,
  className,
}: {
  value: number | null | undefined;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress value={progressValue(value)} className="h-1.5 w-16" />
      <span
        className={cn(
          "w-10 text-xs tabular-nums",
          value === null || value === undefined ? "text-muted-foreground" : "font-medium",
        )}
      >
        {formatPercent(value)}
      </span>
    </div>
  );
}
