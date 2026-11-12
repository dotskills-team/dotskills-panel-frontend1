"use client";

import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKpiList } from "@/features/kpi/hooks/use-kpi";
import {
  formatBdt,
  formatCount,
  formatMonthLabel,
  getMemberName,
} from "@/features/kpi/utils/kpi.utils";
import type { IKpi } from "@/types/kpi.types";
import { KpiStatusBadge } from "./kpi-badges";

interface KpiViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: string;
  kpi: { _id: string; userId: string };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

/** Read-only view of one individual KPI (targets, extra items, note). */
export function KpiViewDialog({ open, onOpenChange, month, kpi }: KpiViewDialogProps) {
  const query = useKpiList(
    { month, type: "individual", userId: kpi.userId, limit: 100 },
    { enabled: open },
  );
  const full: IKpi | undefined = query.data?.data?.find((k) => k._id === kpi._id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{full?.user ? `${getMemberName(full.user)}'s KPI` : "KPI details"}</DialogTitle>
          <DialogDescription>{formatMonthLabel(month)}</DialogDescription>
        </DialogHeader>

        {query.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : query.isError || !full ? (
          <p className="py-6 text-center text-sm text-red-500">Could not load this KPI.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <KpiStatusBadge status={full.status} />
            </div>

            <div className="space-y-2">
              <Row label="Target sales" value={formatBdt(full.targetSales)} />
              <Row label="Target projects" value={formatCount(full.targetProjects)} />
            </div>

            <div className="space-y-2 border-t pt-3">
              <p className="text-sm font-medium">Budget</p>
              {(full.budgetItems ?? []).map((item, i) => (
                <Row key={`${item.name}-${i}`} label={item.name} value={formatBdt(item.amount)} />
              ))}
              <div className="flex items-baseline justify-between gap-3 border-t pt-2 text-sm">
                <span className="font-medium">Total budget</span>
                <span className="font-semibold tabular-nums">{formatBdt(full.budget)}</span>
              </div>
            </div>

            {full.extraItems.length > 0 && (
              <div className="space-y-2 border-t pt-3">
                <p className="text-sm font-medium">Extra targets</p>
                {full.extraItems.map((item) => (
                  <Row
                    key={item.key}
                    label={item.name}
                    value={item.unit === "amount" ? formatBdt(item.target) : formatCount(item.target)}
                  />
                ))}
              </div>
            )}

            {full.note && (
              <div className="space-y-1 border-t pt-3">
                <p className="text-sm font-medium">Note</p>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{full.note}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
