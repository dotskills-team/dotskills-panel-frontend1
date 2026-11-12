"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteKpi } from "@/features/kpi/hooks/use-kpi";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface KpiDeleteButtonProps {
  kpiId: string;
  /** Shown in the confirmation text, e.g. "Rahim's KPI" or "the team KPI". */
  label: string;
  /** "icon" for table rows, "button" for the team card. */
  variant?: "icon" | "button";
}

/** Admin only. Deleting a KPI also removes its monthly report. */
export function KpiDeleteButton({ kpiId, label, variant = "icon" }: KpiDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteKpi();

  const remove = async () => {
    try {
      await mutation.mutateAsync(kpiId);
      toast.success("KPI deleted.");
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete the KPI."));
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${label}`}
          className="text-red-500 hover:text-red-600"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : (
        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => setOpen(true)}>
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Delete
        </Button>
      )}

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this KPI?"
        description={`Deleting ${label} is permanent. Its monthly report, if any, is deleted with it.`}
        confirmText="Delete KPI"
        variant="destructive"
        isLoading={mutation.isPending}
        onConfirm={remove}
      />
    </>
  );
}
