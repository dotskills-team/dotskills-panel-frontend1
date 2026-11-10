"use client";

import { ListChecks, Pencil, Plus, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBdt, formatCount, getMemberName } from "@/features/kpi/utils/kpi.utils";
import type { KpiProgressMember, KpiReportSummaryPerson } from "@/types/kpi.types";
import { KpiReportBadge, KpiStatusBadge, PercentBar } from "./kpi-badges";
import { KpiStatusControl } from "./kpi-status-control";

interface KpiTableProps {
  members: KpiProgressMember[];
  reports?: KpiReportSummaryPerson[];
  reportsError: boolean;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isAdmin: boolean;
  /** Whether the viewer may set, edit or activate this person's KPI (lead: regular members only). */
  canManageRow: (member: KpiProgressMember) => boolean;
  onSetKpi: (userId: string) => void;
  onEdit: (member: KpiProgressMember) => void;
  /** Admin only. */
  onViewProjects: (member: KpiProgressMember) => void;
}

export function KpiTable({
  members,
  reports,
  reportsError,
  isLoading,
  isError,
  onRetry,
  isAdmin,
  canManageRow,
  onSetKpi,
  onEdit,
  onViewProjects,
}: KpiTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-sm text-red-500">Could not load the team KPIs.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <ListChecks className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No team members yet</p>
        <p className="text-xs text-muted-foreground">
          Sales and marketing members will appear here once they are added.
        </p>
      </div>
    );
  }

  const reportByUser = new Map((reports ?? []).map((r) => [r.user._id, r.report]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead className="text-right">Target sales</TableHead>
          <TableHead className="text-right">Target projects</TableHead>
          <TableHead className="text-right">Budget</TableHead>
          <TableHead>Sales achieved</TableHead>
          <TableHead>Projects achieved</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Report</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => {
          const name = getMemberName(m.user);
          const kpi = m.kpi;
          const report = reportByUser.get(m.user._id);
          const canManage = canManageRow(m);

          return (
            <TableRow key={m.user._id}>
              <TableCell className="whitespace-nowrap font-medium">{name}</TableCell>

              {kpi ? (
                <>
                  <TableCell className="text-right tabular-nums">{formatBdt(kpi.targetSales)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCount(kpi.targetProjects)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatBdt(kpi.budget)}</TableCell>
                </>
              ) : (
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Not set
                </TableCell>
              )}

              <TableCell>
                <div className="space-y-1">
                  <p className="text-xs tabular-nums">{formatBdt(m.achievement.achievedSales)}</p>
                  <PercentBar value={m.percentages.sales} />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-xs tabular-nums">{formatCount(m.achievement.achievedProjects)}</p>
                  <PercentBar value={m.percentages.projects} />
                </div>
              </TableCell>

              <TableCell>
                {kpi ? <KpiStatusBadge status={kpi.status} /> : <span className="text-muted-foreground">—</span>}
              </TableCell>

              <TableCell>
                {reportsError ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  <KpiReportBadge status={report?.status ?? (reports ? "none" : undefined)} isLate={report?.isLate} />
                )}
              </TableCell>

              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  {kpi ? (
                    <>
                      {canManage && (kpi.status !== "closed" || isAdmin) ? (
                        <Button variant="ghost" size="icon" aria-label={`Edit KPI for ${name}`} onClick={() => onEdit(m)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      ) : null}
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Project breakdown for ${name}`}
                          onClick={() => onViewProjects(m)}
                        >
                          <ReceiptText className="h-4 w-4" />
                        </Button>
                      )}
                      {canManage && <KpiStatusControl kpiId={kpi._id} status={kpi.status} label={`${name}'s KPI`} />}
                    </>
                  ) : (
                    <>
                      {canManage ? (
                        <Button size="sm" onClick={() => onSetKpi(m.user._id)}>
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Set KPI
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Set by an admin</span>
                      )}
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Project breakdown for ${name}`}
                          onClick={() => onViewProjects(m)}
                        >
                          <ReceiptText className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
