"use client";

import { useState } from "react";
import { History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyKpiProgress, useMyKpiReport } from "@/features/kpi/hooks/use-kpi";
import { formatMonthLabel, shiftMonth } from "@/features/kpi/utils/kpi.utils";
import { KpiReportBadge, PercentBar } from "@/components/dashboard/kpi/kpi-badges";

const PAGE_SIZE = 6;

interface MyKpiHistoryProps {
  /** The month the page is currently showing (highlighted in the list). */
  selectedMonth: string;
  /** The current month; history starts from the month before it. */
  currentMonth: string;
  onOpenMonth: (month: string) => void;
}

function HistoryRow({
  month,
  selected,
  onOpen,
}: {
  month: string;
  selected: boolean;
  onOpen: () => void;
}) {
  const progressQuery = useMyKpiProgress(month);
  const individual = progressQuery.data?.data.individual;
  const kpi = individual?.kpi ?? null;

  // A report exists only for an active or closed KPI
  const hasReportableKpi = Boolean(kpi && kpi.status !== "draft");
  const reportQuery = useMyKpiReport(month, { enabled: hasReportableKpi });
  const reportData = reportQuery.data?.data;

  // Once submitted, the report's percentages come from the frozen snapshot
  const percentages = reportData?.report.snapshot ? reportData.percentages : individual?.percentages;

  let reportCell: React.ReactNode = <span className="text-muted-foreground">—</span>;
  if (hasReportableKpi) {
    if (reportQuery.isLoading) {
      reportCell = <Skeleton className="h-5 w-20" />;
    } else if (reportData) {
      reportCell = (
        <KpiReportBadge
          status={reportData.report._id === null ? "none" : reportData.report.status}
          isLate={reportData.report.isLate}
        />
      );
    }
  }

  return (
    <li className={selected ? "bg-muted/40" : undefined}>
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[10rem_1fr_1fr_9rem_auto]">
        <span className="font-medium">{formatMonthLabel(month)}</span>

        {progressQuery.isLoading ? (
          <Skeleton className="h-5 w-full sm:col-span-3" />
        ) : progressQuery.isError ? (
          <span className="text-xs text-red-500 sm:col-span-3">Could not load this month.</span>
        ) : !kpi ? (
          <span className="text-xs text-muted-foreground sm:col-span-3">No KPI was set</span>
        ) : (
          <>
            <div className="hidden space-y-0.5 sm:block">
              <p className="text-xs text-muted-foreground">Sales</p>
              <PercentBar value={percentages?.sales} />
            </div>
            <div className="hidden space-y-0.5 sm:block">
              <p className="text-xs text-muted-foreground">Projects</p>
              <PercentBar value={percentages?.projects} />
            </div>
            <div className="hidden sm:block">{reportCell}</div>
          </>
        )}

        <Button variant={selected ? "secondary" : "outline"} size="sm" disabled={selected} onClick={onOpen}>
          {selected ? "Viewing" : "Open"}
        </Button>
      </div>
    </li>
  );
}

export function MyKpiHistory({ selectedMonth, currentMonth, onOpenMonth }: MyKpiHistoryProps) {
  const [count, setCount] = useState(PAGE_SIZE);
  const months = Array.from({ length: count }, (_, i) => shiftMonth(currentMonth, -(i + 1)));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <History className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-base">History</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ul className="divide-y border-t">
          {months.map((month) => (
            <HistoryRow
              key={month}
              month={month}
              selected={month === selectedMonth}
              onOpen={() => onOpenMonth(month)}
            />
          ))}
        </ul>
        <div className="flex justify-center border-t p-3">
          <Button variant="ghost" size="sm" onClick={() => setCount((c) => c + PAGE_SIZE)}>
            Show earlier months
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
