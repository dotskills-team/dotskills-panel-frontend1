"use client";

import { Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatBdt,
  formatCount,
  formatMonthLabel,
  formatPercent,
  progressValue,
} from "@/features/kpi/utils/kpi.utils";
import type { IKpi, KpiAchievement, KpiPercentages } from "@/types/kpi.types";
import { KpiStatusBadge } from "@/components/dashboard/kpi/kpi-badges";

/** A labelled progress bar. The bar caps at 100% while the number shows the real percentage. */
export function KpiMeter({
  label,
  achieved,
  target,
  percent,
}: {
  label: string;
  achieved: string;
  target: string;
  percent: number | null | undefined;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{formatPercent(percent)}</span>
      </div>
      <Progress value={progressValue(percent)} className="h-2" />
      <p className="text-xs tabular-nums text-muted-foreground">
        {achieved} of {target}
      </p>
    </div>
  );
}

interface MyKpiCardProps {
  month: string;
  kpi: IKpi | null;
  achievement: KpiAchievement;
  percentages: KpiPercentages;
}

export function MyKpiCard({ month, kpi, achievement, percentages }: MyKpiCardProps) {
  // Only the lead can see their own KPI while it is still a draft
  const isDraft = kpi?.status === "draft";

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">My KPI</CardTitle>
          <span className="text-sm text-muted-foreground">{formatMonthLabel(month)}</span>
        </div>
        {kpi && <KpiStatusBadge status={kpi.status} />}
      </CardHeader>

      <CardContent>
        {!kpi ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Target className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No KPI for {formatMonthLabel(month)}</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Your targets for this month have not been set yet. They will show up here once your lead or an
              admin activates them.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {isDraft && (
              <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                This KPI is still a draft. It is not active yet, so no report can be filed for it.
              </p>
            )}

            <KpiMeter
              label="Sales"
              achieved={formatBdt(achievement.achievedSales)}
              target={formatBdt(kpi.targetSales)}
              percent={percentages.sales}
            />
            <KpiMeter
              label="Projects"
              achieved={formatCount(achievement.achievedProjects)}
              target={formatCount(kpi.targetProjects)}
              percent={percentages.projects}
            />

            <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Budget</span>
              <span className="font-medium tabular-nums">{formatBdt(kpi.budget)}</span>
            </div>

            {kpi.extraItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Extra targets</p>
                <ul className="divide-y rounded-md border text-sm">
                  {kpi.extraItems.map((item) => (
                    <li key={item.key} className="flex items-center justify-between gap-3 px-3 py-2">
                      <span>{item.name}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {item.unit === "amount" ? formatBdt(item.target) : formatCount(item.target)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground">
                  Extra items are reported by you in the monthly report below.
                </p>
              </div>
            )}

            {kpi.note && (
              <p className="whitespace-pre-line rounded-md border p-3 text-xs text-muted-foreground">
                {kpi.note}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
