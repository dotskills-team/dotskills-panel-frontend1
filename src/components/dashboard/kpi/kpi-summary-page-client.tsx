"use client";

import { useState } from "react";
import { ReceiptText, Users } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useKpiReportSummary } from "@/features/kpi/hooks/use-kpi";
import {
  formatBdt,
  formatCount,
  formatMonthLabel,
  getCurrentMonth,
  isKpiAdmin,
  getMemberName,
  toPercent,
} from "@/features/kpi/utils/kpi.utils";
import { useAuthStore } from "@/stores";
import type { KpiReportSummaryPerson, KpiUserRef } from "@/types/kpi.types";
import { KpiAccessGuard } from "./kpi-access-guard";
import { KpiReportBadge, KpiStatusBadge, PercentBar } from "./kpi-badges";
import { KpiMonthPicker } from "./kpi-month-picker";
import { KpiProjectBreakdownDialog } from "./kpi-project-breakdown-dialog";
import { KpiMeter } from "../my-kpi/my-kpi-card";

export default function KpiSummaryPageClient() {
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = isKpiAdmin(role);

  const [month, setMonth] = useState(getCurrentMonth);
  const [breakdownFor, setBreakdownFor] = useState<KpiUserRef | null>(null);

  const query = useKpiReportSummary(month);
  const summary = query.data?.data;

  return (
    <KpiAccessGuard>
      <div className="space-y-6 pb-10">
        <DashboardPageHeader
          title="Team Summary"
          subTitle="Targets against achievement for the whole sales and marketing team."
        />

        <KpiMonthPicker value={month} onChange={setMonth} />

        {query.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : query.isError || !summary ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <p className="text-sm text-red-500">Could not load the team summary.</p>
              <Button variant="outline" size="sm" onClick={() => query.refetch()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Team KPI</CardTitle>
                  <span className="text-sm text-muted-foreground">{formatMonthLabel(month)}</span>
                  {summary.team.kpi && <KpiStatusBadge status={summary.team.kpi.status} />}
                </div>
              </CardHeader>
              <CardContent>
                {summary.team.kpi ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    <KpiMeter
                      label="Team sales"
                      achieved={formatBdt(summary.team.achievement.achievedSales)}
                      target={formatBdt(summary.team.kpi.targetSales)}
                      percent={summary.team.percentages.sales}
                    />
                    <KpiMeter
                      label="Team projects"
                      achieved={formatCount(summary.team.achievement.achievedProjects)}
                      target={formatCount(summary.team.kpi.targetProjects)}
                      percent={summary.team.percentages.projects}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isAdmin
                      ? "No team KPI is set for this month."
                      : "No team KPI has been published for this month."}{" "}
                    Achieved so far: {formatBdt(summary.team.achievement.achievedSales)} from{" "}
                    {formatCount(summary.team.achievement.achievedProjects)} project(s).
                  </p>
                )}
                <p className="mt-4 text-xs text-muted-foreground">
                  Totals add up each person&apos;s figure below: frozen numbers for submitted reports and live
                  numbers for everyone else.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                {summary.people.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">No individual KPIs for {formatMonthLabel(month)}</p>
                    <p className="text-xs text-muted-foreground">Set KPIs on the KPI Management page.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Person</TableHead>
                          <TableHead>Sales</TableHead>
                          <TableHead>Projects</TableHead>
                          <TableHead className="text-right">Budget (spent / planned)</TableHead>
                          <TableHead>Report</TableHead>
                          {isAdmin && <TableHead className="text-right">Projects</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summary.people.map((person) => (
                          <PersonRow
                            key={person.user._id}
                            person={person}
                            isAdmin={isAdmin}
                            onBreakdown={() => setBreakdownFor(person.user)}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Project-wise values are admin only: the dialog is not even mounted for anyone else */}
        {isAdmin && (
          <KpiProjectBreakdownDialog
            open={Boolean(breakdownFor)}
            onOpenChange={(open) => !open && setBreakdownFor(null)}
            month={month}
            userId={breakdownFor?._id}
            userName={breakdownFor ? getMemberName(breakdownFor) : undefined}
          />
        )}
      </div>
    </KpiAccessGuard>
  );
}

function PersonRow({
  person,
  isAdmin,
  onBreakdown,
}: {
  person: KpiReportSummaryPerson;
  isAdmin: boolean;
  onBreakdown: () => void;
}) {
  const { kpi, achievement, percentages, budget } = person;
  const name = getMemberName(person.user);

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap">
        <p className="font-medium">{name}</p>
        <div className="flex items-center gap-1">
          <KpiStatusBadge status={kpi.status} />
          <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
            {person.achievementSource === "snapshot" ? "Final" : "Live"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-xs tabular-nums">
          {formatBdt(achievement.achievedSales)} / {formatBdt(kpi.targetSales)}
        </p>
        <PercentBar value={percentages.sales} />
      </TableCell>
      <TableCell>
        <p className="text-xs tabular-nums">
          {formatCount(achievement.achievedProjects)} / {formatCount(kpi.targetProjects)}
        </p>
        <PercentBar value={percentages.projects} />
      </TableCell>
      <TableCell className="text-right">
        {budget.spent === null ? (
          <p className="text-xs text-muted-foreground">Not reported</p>
        ) : (
          <p className="text-xs tabular-nums">{formatBdt(budget.spent)}</p>
        )}
        <p className="text-xs tabular-nums text-muted-foreground">
          of {formatBdt(budget.planned)}
          {budget.spent !== null && toPercent(budget.spent, budget.planned) !== null
            ? ` (${Math.round(toPercent(budget.spent, budget.planned) as number)}%)`
            : ""}
        </p>
      </TableCell>
      <TableCell>
        <KpiReportBadge status={person.report.status} isLate={person.report.isLate} />
      </TableCell>
      {isAdmin && (
        <TableCell className="text-right">
          <Button variant="ghost" size="icon" aria-label={`Project breakdown for ${name}`} onClick={onBreakdown}>
            <ReceiptText className="h-4 w-4" />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
