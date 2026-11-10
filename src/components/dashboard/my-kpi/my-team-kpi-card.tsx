"use client";

import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBdt, formatCount } from "@/features/kpi/utils/kpi.utils";
import type { IKpi, KpiAchievement, KpiPercentages } from "@/types/kpi.types";
import { KpiStatusBadge } from "@/components/dashboard/kpi/kpi-badges";
import { KpiMeter } from "./my-kpi-card";

interface MyTeamKpiCardProps {
  kpi: IKpi | null;
  achievement: KpiAchievement;
  percentages: KpiPercentages;
}

/** Read-only view of the team target and the team's progress so far. */
export function MyTeamKpiCard({ kpi, achievement, percentages }: MyTeamKpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">Team KPI</CardTitle>
        {kpi && <KpiStatusBadge status={kpi.status} />}
      </CardHeader>

      <CardContent>
        {!kpi ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Users className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No team KPI</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              A team target has not been published for this month.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <KpiMeter
              label="Team sales"
              achieved={formatBdt(achievement.achievedSales)}
              target={formatBdt(kpi.targetSales)}
              percent={percentages.sales}
            />
            <KpiMeter
              label="Team projects"
              achieved={formatCount(achievement.achievedProjects)}
              target={formatCount(kpi.targetProjects)}
              percent={percentages.projects}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
