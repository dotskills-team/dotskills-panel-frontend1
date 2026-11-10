"use client";

import { useState } from "react";
import { Eye, FileText } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import TablePagination from "@/components/shared/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useKpiReports } from "@/features/kpi/hooks/use-kpi";
import { formatMonthLabel, getCurrentMonth, getMemberName, toPercent } from "@/features/kpi/utils/kpi.utils";
import { formatDateTime } from "@/lib/format";
import type { KpiReportRecord, KpiReportStatus } from "@/types/kpi.types";
import { KpiAccessGuard } from "./kpi-access-guard";
import { KpiReportBadge, PercentBar } from "./kpi-badges";
import { KpiMonthPicker } from "./kpi-month-picker";
import { KpiReportDetailDialog } from "./kpi-report-detail-dialog";

const PAGE_SIZE = 10;
type StatusFilter = KpiReportStatus | "all";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "submitted", label: "Submitted (needs review)" },
  { value: "reviewed", label: "Reviewed" },
  { value: "draft", label: "Draft / returned" },
];

export default function KpiReportsPageClient() {
  const [month, setMonth] = useState(getCurrentMonth);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useKpiReports({
    month,
    status: status === "all" ? undefined : status,
    page,
    limit: PAGE_SIZE,
  });

  const reports = query.data?.data ?? [];
  const totalPages = query.data?.meta?.totalPage ?? 1;
  // Look the report up in the live list so the dialog reflects fresh data
  const selected = reports.find((r) => r._id === selectedId) ?? null;

  const changeMonth = (next: string) => {
    setMonth(next);
    setPage(1);
  };

  const changeStatus = (next: StatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  return (
    <KpiAccessGuard>
      <div className="space-y-6 pb-10">
        <DashboardPageHeader
          title="KPI Reports"
          subTitle="Review the monthly reports your team members submit."
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <KpiMonthPicker value={month} onChange={changeMonth} />
          <Select value={status} onValueChange={(v) => changeStatus(v as StatusFilter)}>
            <SelectTrigger className="w-56" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {query.isLoading ? (
              <div className="space-y-2 p-4">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : query.isError ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <p className="text-sm text-red-500">Could not load the reports.</p>
                <Button variant="outline" size="sm" onClick={() => query.refetch()}>
                  Try again
                </Button>
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">No reports for {formatMonthLabel(month)}</p>
                <p className="text-xs text-muted-foreground">
                  {status === "all" ? "Nobody has saved a report yet." : "No report matches this status."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Person</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <ReportRow key={report._id} report={report} onView={() => setSelectedId(report._id)} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isPending={query.isFetching}
        />

        <KpiReportDetailDialog report={selected} onOpenChange={(open) => !open && setSelectedId(null)} />
      </div>
    </KpiAccessGuard>
  );
}

function ReportRow({ report, onView }: { report: KpiReportRecord; onView: () => void }) {
  const { snapshot, kpi } = report;
  const isReturned = report.status === "draft" && Boolean(report.returnComment);

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap">
        <p className="font-medium">{getMemberName(report.user)}</p>
        {report.user.designation && (
          <p className="text-xs text-muted-foreground">{report.user.designation}</p>
        )}
      </TableCell>
      <TableCell>
        {snapshot ? (
          <PercentBar value={toPercent(snapshot.achievedSales, kpi.targetSales)} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        {snapshot ? (
          <PercentBar value={toPercent(snapshot.achievedProjects, kpi.targetProjects)} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-1">
          <KpiReportBadge status={report.status} isLate={report.isLate} />
          {isReturned && (
            <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-300">
              Returned
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap text-sm">
        {report.submittedAt ? formatDateTime(report.submittedAt) : <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" onClick={onView}>
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}
