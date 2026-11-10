"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReturnKpiReport, useReviewKpiReport } from "@/features/kpi/hooks/use-kpi";
import {
  returnCommentSchema,
  reviewCommentSchema,
  type ReviewCommentValues,
} from "@/features/kpi/schemas/kpi.schema";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { KpiReportStatus } from "@/types/kpi.types";

type Mode = "review" | "return";

interface CommentFormProps {
  mode: Mode;
  reportId: string;
  onDone: () => void;
  onCancel: () => void;
}

/** One small form per mode, so each mode gets its own validation rule for the comment. */
function CommentForm({ mode, reportId, onDone, onCancel }: CommentFormProps) {
  const reviewMutation = useReviewKpiReport();
  const returnMutation = useReturnKpiReport();
  const isReturn = mode === "return";
  const isPending = reviewMutation.isPending || returnMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewCommentValues>({
    resolver: zodResolver(isReturn ? returnCommentSchema : reviewCommentSchema),
    defaultValues: { comment: "" },
  });

  const onSubmit = async ({ comment }: ReviewCommentValues) => {
    try {
      if (isReturn) {
        await returnMutation.mutateAsync({ id: reportId, comment });
        toast.success("Report returned to the member.");
      } else {
        await reviewMutation.mutateAsync({ id: reportId, comment: comment || undefined });
        toast.success("Report marked as reviewed.");
      }
      onDone();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update the report."));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-md border p-3" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="report-action-comment">
          {isReturn ? "Reason for returning (required)" : "Comment (optional)"}
        </Label>
        <Textarea
          id="report-action-comment"
          rows={3}
          disabled={isPending}
          placeholder={isReturn ? "Tell the member what to fix." : "Anything the member should know."}
          {...register("comment")}
        />
        {errors.comment && <p className="text-xs text-red-500">{errors.comment.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" variant={isReturn ? "destructive" : "default"} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {isReturn ? "Return for changes" : "Mark reviewed"}
        </Button>
      </div>
    </form>
  );
}

interface KpiReportActionPanelProps {
  reportId: string;
  status: KpiReportStatus;
  /** False when the viewer may not act on this report (for example the lead on their own report). */
  canModerate: boolean;
  /** Called after a successful review or return. */
  onDone: () => void;
}

export function KpiReportActionPanel({ reportId, status, canModerate, onDone }: KpiReportActionPanelProps) {
  const [mode, setMode] = useState<Mode | null>(null);

  if (!canModerate) {
    return (
      <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
        You can view this report, but only an admin can review it.
      </p>
    );
  }

  if (status === "draft") {
    return (
      <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
        This report is still a draft. It can be reviewed once the member submits it.
      </p>
    );
  }

  if (mode) {
    return (
      <CommentForm
        key={mode}
        mode={mode}
        reportId={reportId}
        onCancel={() => setMode(null)}
        onDone={() => {
          setMode(null);
          onDone();
        }}
      />
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {/* A reviewed report can still be sent back, but not reviewed twice */}
      <Button variant="outline" onClick={() => setMode("return")}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Return for changes
      </Button>
      {status === "submitted" && (
        <Button onClick={() => setMode("review")}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark reviewed
        </Button>
      )}
    </div>
  );
}
