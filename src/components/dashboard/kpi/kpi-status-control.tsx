"use client";

import { useState } from "react";
import { Loader2, Lock, Play } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useUpdateKpiStatus } from "@/features/kpi/hooks/use-kpi";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { KpiStatus } from "@/types/kpi.types";

interface KpiStatusControlProps {
  kpiId: string;
  status: KpiStatus;
  /** Shown in the confirmation text, e.g. "Rahim's KPI" or "the team KPI". */
  label: string;
  size?: "sm" | "default";
}

/** Status only moves forward: draft -> active -> closed. */
export function KpiStatusControl({ kpiId, status, label, size = "sm" }: KpiStatusControlProps) {
  const [confirmClose, setConfirmClose] = useState(false);
  const mutation = useUpdateKpiStatus();

  if (status === "closed") return null;

  const change = async (next: "active" | "closed") => {
    try {
      await mutation.mutateAsync({ id: kpiId, status: next });
      toast.success(next === "active" ? "KPI activated." : "KPI closed.");
      setConfirmClose(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to change the KPI status."));
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {status === "draft" && (
          <Button
            type="button"
            variant="outline"
            size={size}
            disabled={mutation.isPending}
            onClick={() => change("active")}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="mr-1 h-3.5 w-3.5" />
            )}
            Activate
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size={size}
          disabled={mutation.isPending}
          onClick={() => setConfirmClose(true)}
        >
          <Lock className="mr-1 h-3.5 w-3.5" />
          Close
        </Button>
      </div>

      <ConfirmDialog
        open={confirmClose}
        onOpenChange={setConfirmClose}
        title="Close this KPI?"
        description={`Closing ${label} is final: it cannot be reopened, and only an admin can change the targets.`}
        confirmText="Close KPI"
        variant="destructive"
        isLoading={mutation.isPending}
        onConfirm={() => change("closed")}
      />
    </>
  );
}
