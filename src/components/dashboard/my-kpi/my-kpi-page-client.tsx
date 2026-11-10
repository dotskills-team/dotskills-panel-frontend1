"use client";

import { useState } from "react";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { KpiMonthPicker } from "@/components/dashboard/kpi/kpi-month-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyKpiProgress, useMyKpiReport } from "@/features/kpi/hooks/use-kpi";
import { getCurrentMonth } from "@/features/kpi/utils/kpi.utils";
import { isMarketingSalesTeam } from "@/features/users/utils/user.utils";
import { useAuthStore } from "@/stores";
import { MyCreditedProjects } from "./my-credited-projects";
import { MyKpiCard } from "./my-kpi-card";
import { MyKpiHistory } from "./my-kpi-history";
import { MyKpiReportForm } from "./my-kpi-report-form";
import { MyTeamKpiCard } from "./my-team-kpi-card";

function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-10">
        <p className="text-sm text-red-500">{message}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}

export default function MyKpiPageClient() {
  const user = useAuthStore((s) => s.user);
  const hasAccess = isMarketingSalesTeam(user?.role);

  // Fixed once per mount: history lists the months before this one
  const [currentMonth] = useState(getCurrentMonth);
  const [month, setMonth] = useState(currentMonth);

  const progressQuery = useMyKpiProgress(month, { enabled: hasAccess });
  const progress = progressQuery.data?.data;
  const kpi = progress?.individual.kpi ?? null;

  // A report exists only for an active or closed KPI (the endpoint answers 404 otherwise)
  const reportEnabled = hasAccess && Boolean(kpi && kpi.status !== "draft");
  const reportQuery = useMyKpiReport(month, { enabled: reportEnabled });
  const reportData = reportQuery.data?.data;

  if (!user) return null;

  if (!hasAccess) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold">My KPI is available to sales and marketing members.</p>
      </div>
    );
  }

  const openMonth = (next: string) => {
    setMonth(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 pb-10">
      <DashboardPageHeader
        title="My KPI"
        subTitle="Your monthly targets, your progress and your monthly report."
      />

      <KpiMonthPicker value={month} onChange={setMonth} />

      {progressQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : progressQuery.isError || !progress ? (
        <ErrorBlock message="Could not load your KPI." onRetry={() => progressQuery.refetch()} />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <MyKpiCard
              month={month}
              kpi={kpi}
              achievement={progress.individual.achievement}
              percentages={progress.individual.percentages}
            />
            <MyTeamKpiCard
              kpi={progress.team.kpi}
              achievement={progress.team.achievement}
              percentages={progress.team.percentages}
            />
          </div>

          <MyCreditedProjects month={month} projects={progress.creditedProjects} />

          {reportEnabled &&
            (reportQuery.isLoading ? (
              <Skeleton className="h-96 w-full" />
            ) : reportQuery.isError || !reportData ? (
              <ErrorBlock message="Could not load your monthly report." onRetry={() => reportQuery.refetch()} />
            ) : (
              <MyKpiReportForm
                key={`${month}:${reportData.report.status}:${reportData.report.updatedAt ?? ""}`}
                month={month}
                data={reportData}
              />
            ))}
        </>
      )}

      <MyKpiHistory selectedMonth={month} currentMonth={currentMonth} onOpenMonth={openMonth} />
    </div>
  );
}
