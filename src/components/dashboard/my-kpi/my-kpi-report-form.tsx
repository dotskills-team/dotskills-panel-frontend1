"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSaveReportDraft, useSubmitKpiReport } from "@/features/kpi/hooks/use-kpi";
import {
  kpiReportFormSchema,
  type KpiReportFormInput,
  type KpiReportFormValues,
} from "@/features/kpi/schemas/kpi.schema";
import {
  formatBdt,
  formatCount,
  formatMonthLabel,
  getMemberName,
} from "@/features/kpi/utils/kpi.utils";
import { formatDateTime } from "@/lib/format";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { KpiMyReport, KpiReportContentPayload } from "@/types/kpi.types";
import { KpiReportBadge, PercentBar } from "@/components/dashboard/kpi/kpi-badges";

interface MyKpiReportFormProps {
  month: string;
  data: KpiMyReport;
}

/**
 * The parent mounts this with a key built from the report status and update time,
 * so the form starts from fresh defaults after every save, submit, review or return.
 */
export function MyKpiReportForm({ month, data }: MyKpiReportFormProps) {
  const { kpi, report, liveAchievement, percentages, timing } = data;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const saveMutation = useSaveReportDraft();
  const submitMutation = useSubmitKpiReport();
  const isBusy = saveMutation.isPending || submitMutation.isPending;

  const isDraft = report.status === "draft";
  // A returned report is a draft that carries the reviewer's return comment
  const isReturned = isDraft && Boolean(report.returnComment);
  const readOnly = !isDraft;

  // Before submit the numbers are live; afterwards the frozen snapshot is the official value
  const shown = report.snapshot ?? liveAchievement;
  const isSnapshot = Boolean(report.snapshot);

  const { register, handleSubmit, formState } = useForm<KpiReportFormInput, unknown, KpiReportFormValues>({
    resolver: zodResolver(kpiReportFormSchema),
    defaultValues: {
      actualBudgetSpent: report.actualBudgetSpent ?? 0,
      // One row per KPI extra item, in KPI order; missing results start at 0
      extraItemResults: kpi.extraItems.map((item) => ({
        key: item.key,
        achieved: report.extraItemResults.find((r) => r.key === item.key)?.achieved ?? 0,
      })),
      summary: report.summary ?? "",
      challenges: report.challenges ?? "",
    },
  });
  const { errors } = formState;

  const toPayload = (values: KpiReportFormValues): KpiReportContentPayload => ({
    actualBudgetSpent: values.actualBudgetSpent,
    extraItemResults: kpi.extraItems.map((item, index) => ({
      key: item.key,
      achieved: values.extraItemResults[index]?.achieved ?? 0,
    })),
    summary: values.summary,
    challenges: values.challenges,
  });

  const onSaveDraft = async (values: KpiReportFormValues) => {
    try {
      await saveMutation.mutateAsync({ month, payload: toPayload(values) });
      toast.success("Draft saved.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save the draft."));
    }
  };

  const onSubmit = async (values: KpiReportFormValues) => {
    try {
      await submitMutation.mutateAsync({ month, payload: toPayload(values) });
      toast.success("Report submitted.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to submit the report."));
    } finally {
      setConfirmOpen(false);
    }
  };

  // Why the Submit button is disabled (null when it is allowed)
  const submitBlockedReason: string | null = timing.canSubmit
    ? null
    : `You can submit this report from ${formatDateTime(timing.submitOpensAt)}.`;

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Monthly report</CardTitle>
          <span className="text-sm text-muted-foreground">{formatMonthLabel(month)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isReturned && (
            <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-300">
              Returned
            </Badge>
          )}
          <KpiReportBadge status={report.status} isLate={report.isLate} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {isReturned && (
          <Alert>
            <RotateCcw className="h-4 w-4" />
            <AlertTitle>
              Returned for changes
              {report.returnedBy ? ` by ${getMemberName(report.returnedBy)}` : ""}
              {report.returnedAt ? ` on ${formatDateTime(report.returnedAt)}` : ""}
            </AlertTitle>
            <AlertDescription className="whitespace-pre-line">{report.returnComment}</AlertDescription>
          </Alert>
        )}

        {report.status === "reviewed" && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>
              Reviewed
              {report.reviewedBy ? ` by ${getMemberName(report.reviewedBy)}` : ""}
              {report.reviewedAt ? ` on ${formatDateTime(report.reviewedAt)}` : ""}
            </AlertTitle>
            <AlertDescription className="whitespace-pre-line">
              {report.reviewComment || "No comment was left."}
            </AlertDescription>
          </Alert>
        )}

        {report.status === "submitted" && (
          <p className="text-sm text-muted-foreground">
            Submitted{report.submittedAt ? ` on ${formatDateTime(report.submittedAt)}` : ""}. The report is
            locked while it waits for review.
          </p>
        )}

        {/* Achievement is computed by the server and cannot be edited */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Achievement{" "}
            <span className="text-xs font-normal text-muted-foreground">
              {isSnapshot ? "(frozen when the report was submitted)" : "(live, updates until you submit)"}
            </span>
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 rounded-md border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Achieved sales</p>
              <p className="text-lg font-semibold tabular-nums">{formatBdt(shown.achievedSales)}</p>
              <PercentBar value={percentages.sales} />
            </div>
            <div className="space-y-1.5 rounded-md border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Achieved projects</p>
              <p className="text-lg font-semibold tabular-nums">{formatCount(shown.achievedProjects)}</p>
              <PercentBar value={percentages.projects} />
            </div>
          </div>
        </div>

        <form className="space-y-4" noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <Label htmlFor="report-budget">
              Actual budget spent (BDT)
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Planned: {formatBdt(kpi.budget)}
              </span>
            </Label>
            <Input
              id="report-budget"
              type="number"
              min={0}
              step="any"
              disabled={readOnly || isBusy}
              {...register("actualBudgetSpent")}
            />
            {errors.actualBudgetSpent && (
              <p className="text-xs text-red-500">{errors.actualBudgetSpent.message}</p>
            )}
          </div>

          {kpi.extraItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Extra items</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {kpi.extraItems.map((item, index) => (
                  <div key={item.key} className="space-y-1.5">
                    <Label htmlFor={`report-extra-${index}`}>
                      {item.name}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        Target: {item.unit === "amount" ? formatBdt(item.target) : formatCount(item.target)}
                      </span>
                    </Label>
                    <Input
                      id={`report-extra-${index}`}
                      type="number"
                      min={0}
                      step={item.unit === "count" ? 1 : "any"}
                      disabled={readOnly || isBusy}
                      {...register(`extraItemResults.${index}.achieved`)}
                    />
                    {errors.extraItemResults?.[index]?.achieved && (
                      <p className="text-xs text-red-500">{errors.extraItemResults[index]?.achieved?.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="report-summary">Summary</Label>
            <Textarea
              id="report-summary"
              rows={4}
              placeholder="What did you achieve this month?"
              disabled={readOnly || isBusy}
              {...register("summary")}
            />
            {errors.summary && <p className="text-xs text-red-500">{errors.summary.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-challenges">Challenges</Label>
            <Textarea
              id="report-challenges"
              rows={4}
              placeholder="What got in the way?"
              disabled={readOnly || isBusy}
              {...register("challenges")}
            />
            {errors.challenges && <p className="text-xs text-red-500">{errors.challenges.message}</p>}
          </div>

          {!readOnly && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isBusy}
                  onClick={handleSubmit(onSaveDraft)}
                >
                  {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save draft
                </Button>
                <Button
                  type="button"
                  disabled={isBusy || Boolean(submitBlockedReason)}
                  // Validate first, then ask for confirmation
                  onClick={handleSubmit(() => setConfirmOpen(true))}
                >
                  Submit report
                </Button>
              </div>

              {submitBlockedReason ? (
                <p className="text-right text-xs text-muted-foreground">{submitBlockedReason}</p>
              ) : timing.isPastDeadline ? (
                <p className="text-right text-xs text-amber-600">
                  The deadline ({formatDateTime(timing.deadlineAt)}) has passed. This report will be marked
                  as late.
                </p>
              ) : (
                <p className="text-right text-xs text-muted-foreground">
                  Submit before {formatDateTime(timing.deadlineAt)} to be on time.
                </p>
              )}
            </div>
          )}
        </form>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Submit this report?"
        description="Your achieved sales and projects will be frozen at their current values. You cannot edit the report afterwards unless your lead returns it."
        confirmText="Submit report"
        isLoading={submitMutation.isPending}
        onConfirm={handleSubmit(onSubmit)}
      />
    </Card>
  );
}
