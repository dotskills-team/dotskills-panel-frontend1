"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaveDashboardSummary } from "@/features/leave/hooks/use-leave";
import { LEAVE_TYPE_LABEL } from "@/features/leave/constants/leave.constant";
import { formatDateRange } from "./leave-badges";

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-xl font-bold tracking-tight ${tone ?? ""}`}>{value}</p>
    </div>
  );
}

/**
 * Leave widgets for the main dashboard: the person's own balance (not for admins, who do
 * not request leave) and, for managers and admins, who is out today and what needs a decision.
 */
export function LeaveDashboardWidget() {
  const { data, isLoading, isError } = useLeaveDashboardSummary();

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;
  // The dashboard must still work when leave data is unavailable.
  if (isError || !data) return null;

  const { personal, team } = data.data;
  if (!personal && !team) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <CalendarDays className="size-5 text-teal-600" /> Leave
        </h2>
        <Link href="/dashboard/leave" className="text-sm text-indigo-600 hover:underline">
          Open leave
        </Link>
      </div>

      <div className={personal && team ? "grid gap-4 lg:grid-cols-2" : "grid gap-4"}>
        {personal && (
          <Card>
            <CardContent className="space-y-4 p-5">
              <p className="text-sm font-medium">My leave</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat label="Total" value={fmt(personal.balance.totalQuota)} />
                <Stat label="Used" value={fmt(personal.balance.used)} />
                <Stat
                  label="Remaining"
                  value={fmt(Math.max(personal.balance.remaining, 0))}
                  tone={personal.balance.remaining <= 0 ? "text-red-600" : "text-emerald-600"}
                />
                <Stat label="Pending" value={String(personal.pendingCount)} />
              </div>
              {personal.balance.extraDays > 0 && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Extra leave: {fmt(personal.balance.extraDays)} day(s)
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {personal.nextLeave
                  ? `Next leave: ${LEAVE_TYPE_LABEL[personal.nextLeave.leaveType]}, ${formatDateRange(
                      personal.nextLeave.startDate,
                      personal.nextLeave.endDate,
                    )}`
                  : "No upcoming leave."}
              </p>
            </CardContent>
          </Card>
        )}

        {team && (
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Team today</p>
                {team.pendingApprovals > 0 && (
                  <Link
                    href="/dashboard/leave"
                    className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                  >
                    {team.pendingApprovals} waiting for approval
                  </Link>
                )}
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium uppercase text-muted-foreground">On leave today</p>
                {team.onLeaveToday.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Everyone is in.</p>
                ) : (
                  <ul className="space-y-1">
                    {team.onLeaveToday.map((p) => (
                      <li key={`${p.staffId}-${p.until}`} className="flex justify-between gap-2 text-sm">
                        <span className="truncate">
                          {p.name}
                          {p.halfDaySession && (
                            <span className="text-muted-foreground"> ({p.halfDaySession})</span>
                          )}
                        </span>
                        <span className={p.isExtra ? "text-red-600" : "text-muted-foreground"}>
                          {LEAVE_TYPE_LABEL[p.leaveType]}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {team.topLeaveTakers.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase text-muted-foreground">
                    Most leave this month
                  </p>
                  <ul className="space-y-1">
                    {team.topLeaveTakers.map((t) => (
                      <li key={t.staffId} className="flex justify-between gap-2 text-sm">
                        <span className="truncate">{t.name}</span>
                        <span className="text-muted-foreground">{fmt(t.totalDays)}d</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
