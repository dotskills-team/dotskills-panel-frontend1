"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  canModerateReport,
  formatBdt,
  formatCount,
  formatMonthLabel,
  getMemberName,
  toPercent,
} from "@/features/kpi/utils/kpi.utils";
import { formatDateTime } from "@/lib/format";
import { useAuthStore } from "@/stores";
import type { KpiReportRecord } from "@/types/kpi.types";
import { KpiReportBadge, PercentBar } from "./kpi-badges";
import { KpiReportActionPanel } from "./kpi-report-action-panel";

interface KpiReportDetailDialogProps {
  report: KpiReportRecord | null;
  onOpenChange: (open: boolean) => void;
}

function TextBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <p className="whitespace-pre-line rounded-md border bg-muted/30 p-3 text-sm">
        {value?.trim() ? value : <span className="text-muted-foreground">Nothing written.</span>}
      </p>
    </div>
  );
}

export function KpiReportDetailDialog({ report, onOpenChange }: KpiReportDetailDialogProps) {
  const viewer = useAuthStore((s) => s.user);

  return (
    <Dialog open={Boolean(report)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {report && (
          <ReportDetail
            report={report}
            canModerate={canModerateReport(viewer, report.user)}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReportDetail({
  report,
  canModerate,
  onClose,
}: {
  report: KpiReportRecord;
  canModerate: boolean;
  onClose: () => void;
}) {
  const { kpi, snapshot } = report;
  const isReturned = report.status === "draft" && Boolean(report.returnComment);

  // The snapshot exists only once the member has submitted
  const sales = snapshot?.achievedSales;
  const projects = snapshot?.achievedProjects;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex flex-wrap items-center gap-2">
          {getMemberName(report.user)}
          <KpiReportBadge status={report.status} isLate={report.isLate} />
          {isReturned && (
            <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-300">
              Returned
            </Badge>
          )}
        </DialogTitle>
        <DialogDescription>
          {formatMonthLabel(report.month)}
          {report.submittedAt ? ` · Submitted ${formatDateTime(report.submittedAt)}` : " · Not submitted"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Measure</TableHead>
              <TableHead className="text-right">Target</TableHead>
              <TableHead className="text-right">Achieved</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Sales</TableCell>
              <TableCell className="text-right tabular-nums">{formatBdt(kpi.targetSales)}</TableCell>
              <TableCell className="text-right tabular-nums">
                {sales === undefined ? "—" : formatBdt(sales)}
              </TableCell>
              <TableCell>
                <PercentBar value={sales === undefined ? null : toPercent(sales, kpi.targetSales)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Projects</TableCell>
              <TableCell className="text-right tabular-nums">{formatCount(kpi.targetProjects)}</TableCell>
              <TableCell className="text-right tabular-nums">
                {projects === undefined ? "—" : formatCount(projects)}
              </TableCell>
              <TableCell>
                <PercentBar value={projects === undefined ? null : toPercent(projects, kpi.targetProjects)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Budget (planned / spent)</TableCell>
              <TableCell className="text-right tabular-nums">{formatBdt(kpi.budget)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatBdt(report.actualBudgetSpent)}</TableCell>
              <TableCell>
                <PercentBar value={toPercent(report.actualBudgetSpent, kpi.budget)} />
              </TableCell>
            </TableRow>
            {kpi.extraItems.map((item) => {
              const achieved = report.extraItemResults.find((r) => r.key === item.key)?.achieved ?? 0;
              const format = item.unit === "amount" ? formatBdt : formatCount;
              return (
                <TableRow key={item.key}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{format(item.target)}</TableCell>
                  <TableCell className="text-right tabular-nums">{format(achieved)}</TableCell>
                  <TableCell>
                    <PercentBar value={toPercent(achieved, item.target)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {!snapshot && (
          <p className="text-xs text-muted-foreground">
            Sales and projects are frozen when the member submits, so they are not shown for a draft.
          </p>
        )}

        <TextBlock label="Summary" value={report.summary} />
        <TextBlock label="Challenges" value={report.challenges} />

        {isReturned && (
          <div className="space-y-1 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950">
            <p className="font-medium">
              Returned
              {report.returnedBy ? ` by ${getMemberName(report.returnedBy)}` : ""}
              {report.returnedAt ? ` on ${formatDateTime(report.returnedAt)}` : ""}
            </p>
            <p className="whitespace-pre-line">{report.returnComment}</p>
          </div>
        )}

        {report.status === "reviewed" && (
          <div className="space-y-1 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm dark:border-emerald-900 dark:bg-emerald-950">
            <p className="font-medium">
              Reviewed
              {report.reviewedBy ? ` by ${getMemberName(report.reviewedBy)}` : ""}
              {report.reviewedAt ? ` on ${formatDateTime(report.reviewedAt)}` : ""}
            </p>
            <p className="whitespace-pre-line">{report.reviewComment || "No comment was left."}</p>
          </div>
        )}

        <KpiReportActionPanel
          reportId={report._id}
          status={report.status}
          canModerate={canModerate}
          onDone={onClose}
        />
      </div>
    </>
  );
}
