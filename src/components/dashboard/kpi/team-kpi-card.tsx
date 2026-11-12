"use client";

import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  compareTargets,
  formatBdt,
  formatCount,
  formatMonthLabel,
  formatPercent,
  progressValue,
} from "@/features/kpi/utils/kpi.utils";
import type { KpiProgress, KpiTeamContext } from "@/types/kpi.types";
import { KpiStatusBadge } from "./kpi-badges";
import { KpiDeleteButton } from "./kpi-delete-button";
import { KpiStatusControl } from "./kpi-status-control";

interface TeamKpiCardProps {
  month: string;
  /** Admins can set and edit the team KPI. The lead only sees it. */
  isAdmin: boolean;
  progress?: KpiProgress;
  progressLoading: boolean;
  progressError: boolean;
  /** Admin only. */
  context?: KpiTeamContext;
  contextLoading: boolean;
  contextError: boolean;
  onEdit: () => void;
  onCreate: () => void;
}

function Meter({
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

function SumLine({ label, sum, team, format }: { label: string; sum: number; team: number; format: (n: number) => string }) {
  const cmp = compareTargets(team, sum);
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">
        <span className="font-medium">{format(sum)}</span>
        <span className="text-muted-foreground"> / team {format(team)}</span>
        {cmp.state !== "match" && (
          <span className={cmp.state === "over" ? "ml-2 text-amber-600" : "ml-2 text-muted-foreground"}>
            ({cmp.state === "over" ? "+" : "-"}
            {format(cmp.diff)})
          </span>
        )}
      </span>
    </div>
  );
}

export function TeamKpiCard({
  month,
  isAdmin,
  progress,
  progressLoading,
  progressError,
  context,
  contextLoading,
  contextError,
  onEdit,
  onCreate,
}: TeamKpiCardProps) {
  const loading = progressLoading || (isAdmin && contextLoading);
  const failed = progressError || (isAdmin && contextError);

  // Admins read the full team KPI; the lead gets the summary that is only shared once active
  const teamKpi = isAdmin ? context?.team : progress?.team.kpi;
  const achievement = progress?.team.achievement;
  const percentages = progress?.team.percentages;
  const sums = context?.sumOfIndividualTargets;

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Team KPI</CardTitle>
          <span className="text-sm text-muted-foreground">{formatMonthLabel(month)}</span>
          {teamKpi && <KpiStatusBadge status={teamKpi.status} />}
        </div>

        {isAdmin && !loading && !failed && (
          <div className="flex items-center gap-2">
            {teamKpi && <KpiStatusControl kpiId={teamKpi._id} status={teamKpi.status} label="the team KPI" />}
            {teamKpi ? (
              <>
                <Button size="sm" variant="outline" onClick={onEdit}>
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Edit team KPI
                </Button>
                <KpiDeleteButton kpiId={teamKpi._id} label="the team KPI" variant="button" />
              </>
            ) : (
              <Button size="sm" onClick={onCreate}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                Set team KPI
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : failed ? (
          <p className="py-4 text-center text-sm text-red-500">Could not load the team KPI.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {teamKpi ? (
                <>
                  <Meter
                    label="Team sales"
                    achieved={formatBdt(achievement?.achievedSales)}
                    target={formatBdt(teamKpi.targetSales)}
                    percent={percentages?.sales}
                  />
                  <Meter
                    label="Team projects"
                    achieved={formatCount(achievement?.achievedProjects)}
                    target={formatCount(teamKpi.targetProjects)}
                    percent={percentages?.projects}
                  />
                  <p className="text-xs text-muted-foreground">Budget: {formatBdt(teamKpi.budget)}</p>
                </>
              ) : (
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    {isAdmin ? "No team KPI is set for this month." : "No team KPI has been published for this month."}
                  </p>
                  {achievement && (
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Achieved so far: {formatBdt(achievement.achievedSales)} from{" "}
                      {formatCount(achievement.achievedProjects)} project(s)
                    </p>
                  )}
                </div>
              )}
            </div>

            {isAdmin && sums && (
              <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                <p className="text-sm font-medium">
                  Sum of individual targets
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    ({sums.individualCount} member{sums.individualCount === 1 ? "" : "s"})
                  </span>
                </p>
                <SumLine
                  label="Sales"
                  sum={sums.targetSales}
                  team={teamKpi?.targetSales ?? 0}
                  format={formatBdt}
                />
                <SumLine
                  label="Projects"
                  sum={sums.targetProjects}
                  team={teamKpi?.targetProjects ?? 0}
                  format={formatCount}
                />
                <SumLine
                  label="Budget"
                  sum={sums.budget}
                  team={teamKpi?.budget ?? 0}
                  format={formatBdt}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
