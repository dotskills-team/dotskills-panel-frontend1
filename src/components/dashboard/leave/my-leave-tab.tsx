"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, Eye, Plus, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import {
  useCancelLeaveRequest,
  useLeaveRequests,
  useMyLeaveBalance,
} from "@/features/leave/hooks/use-leave";
import {
  LEAVE_STATUS_OPTIONS,
  LEAVE_TYPE_LABEL,
  LEAVE_TYPE_OPTIONS,
} from "@/features/leave/constants/leave.constant";
import type { ILeaveRequest } from "@/types/leave.types";

import { LeaveRequestFormDialog } from "./leave-request-form-dialog";
import { RequestDetailSheet } from "./request-detail-sheet";
import { ExtraLeaveBadge, LeaveStatusBadge, formatDateRange } from "./leave-badges";

const fmtDays = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

type TileTone = "indigo" | "slate" | "emerald" | "amber" | "red";

// Each tone pairs a light-mode tint with a dark-mode tint so text keeps its contrast in both themes.
const TILE_TONES: Record<TileTone, { box: string; label: string; value: string }> = {
  indigo: {
    box: "bg-indigo-50 border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/60",
    label: "text-indigo-700/80 dark:text-indigo-300/80",
    value: "text-indigo-900 dark:text-indigo-100",
  },
  slate: {
    box: "bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800",
    label: "text-slate-600 dark:text-slate-400",
    value: "text-slate-900 dark:text-slate-100",
  },
  emerald: {
    box: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/60",
    label: "text-emerald-700/80 dark:text-emerald-300/80",
    value: "text-emerald-900 dark:text-emerald-100",
  },
  amber: {
    box: "bg-amber-50 border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/60",
    label: "text-amber-700/80 dark:text-amber-300/80",
    value: "text-amber-900 dark:text-amber-100",
  },
  red: {
    box: "bg-red-50 border-red-100 dark:bg-red-950/40 dark:border-red-900/60",
    label: "text-red-700/80 dark:text-red-300/80",
    value: "text-red-900 dark:text-red-100",
  },
};

function Tile({ label, value, tone }: { label: string; value: string; tone: TileTone }) {
  const t = TILE_TONES[tone];
  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${t.box}`}
    >
      <p className={`text-[11px] font-medium uppercase tracking-wide ${t.label}`}>{label}</p>
      <p className={`mt-1 text-xl font-bold tracking-tight ${t.value}`}>{value}</p>
    </div>
  );
}

function BalanceCard() {
  const { data, isLoading, isError, error } = useMyLeaveBalance();
  const b = data?.data;

  if (isLoading) return <Skeleton className="h-52 w-full rounded-2xl" />;
  if (isError || !b) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error instanceof Error ? error.message : "Unable to load your leave balance."}
      </div>
    );
  }

  const total = b.totalQuota + b.carriedForward;
  const usedPct = total > 0 ? Math.min(100, Math.round((b.used / total) * 100)) : 100;
  const exhausted = b.remaining <= 0;

  return (
    <Card className="relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Accent stripe: indigo normally, red once the balance is used up */}
      <div className={`absolute inset-x-0 top-0 h-1 ${exhausted ? "bg-red-500" : "bg-linear-to-r from-indigo-500 to-violet-500"}`} />
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Leave balance {b.year}</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-4xl font-bold tracking-tight ${
                  exhausted ? "text-red-600 dark:text-red-400" : "text-foreground"
                }`}
              >
                {fmtDays(Math.max(b.remaining, 0))}
              </span>
              <span className="text-base font-medium text-muted-foreground">days remaining</span>
            </p>
          </div>
          {b.carriedForward > 0 && (
            <span className="rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
              Includes {fmtDays(b.carriedForward)} carried forward
            </span>
          )}
        </div>

        <div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={usedPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Leave used"
          >
            <div
              className={`h-full rounded-full transition-all ${exhausted ? "bg-red-500" : "bg-indigo-600 dark:bg-indigo-500"}`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {fmtDays(b.used)} of {fmtDays(total)} days used
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile label="Total" value={fmtDays(total)} tone="indigo" />
          <Tile label="Used" value={fmtDays(b.used)} tone="slate" />
          <Tile label="Remaining" value={fmtDays(Math.max(b.remaining, 0))} tone={exhausted ? "red" : "emerald"} />
          <Tile label="Pending" value={`${b.pendingCount} (${fmtDays(b.pendingDays)}d)`} tone="amber" />
        </div>

        {(b.extraDays > 0 || b.pendingExtraDays > 0) && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
            Extra leave: {fmtDays(b.extraDays)} day(s) approved
            {b.pendingExtraDays > 0 && `, ${fmtDays(b.pendingExtraDays)} day(s) waiting for approval`}.
            {b.advanceUsed > 0 && ` ${fmtDays(b.advanceUsed)} day(s) will be deducted from next year.`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function MyLeaveTab() {
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [leaveType, setLeaveType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ILeaveRequest | null>(null);

  const list = useLeaveRequests({
    page,
    limit: 10,
    status: status === "ALL" ? undefined : status,
    leaveType: leaveType === "ALL" ? undefined : leaveType,
    sort: "-createdAt",
    mine: "true", // approvers would otherwise get everyone's requests here
  });
  const cancel = useCancelLeaveRequest();

  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancel.mutateAsync(cancelTarget._id);
      toast.success("Request cancelled");
      setCancelTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to cancel request");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <LeaveRequestFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <RequestDetailSheet requestId={viewing} onOpenChange={(o) => !o && setViewing(null)} />
      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        title="Cancel this request?"
        description="The request will be withdrawn. You can submit a new one later."
        confirmText="Cancel request"
        variant="destructive"
        isLoading={cancel.isPending}
        onConfirm={confirmCancel}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <BalanceCard />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All status</SelectItem>
            {LEAVE_STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={leaveType}
          onValueChange={(v) => {
            setLeaveType(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            {LEAVE_TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="ml-auto bg-indigo-600 text-white hover:bg-indigo-500" onClick={() => setFormOpen(true)}>
          <Plus /> New request
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          {list.isError ? (
            <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {list.error instanceof Error ? list.error.message : "Unable to load requests."}
            </div>
          ) : list.isLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="m-4 flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <CalendarPlus className="text-muted-foreground" />
              <div>
                <p className="font-medium">No leave requests yet</p>
                <p className="text-sm text-muted-foreground">Your requests will appear here.</p>
              </div>
              <Button variant="outline" onClick={() => setFormOpen(true)}>
                New request
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-170 text-sm">
                <thead>
                  <tr className="border-b bg-indigo-600 text-left text-xs text-white">
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium">Dates</th>
                    <th className="p-3 font-medium">Days</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium">{LEAVE_TYPE_LABEL[r.leaveType]}</td>
                      <td className="p-3">{formatDateRange(r.startDate, r.endDate)}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span>{fmtDays(r.totalDays)}</span>
                          <ExtraLeaveBadge days={r.extraDays} />
                        </div>
                      </td>
                      <td className="p-3">
                        <LeaveStatusBadge status={r.status} />
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="View request"
                            onClick={() => setViewing(r._id)}
                          >
                            <Eye />
                          </Button>
                          {r.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Cancel request"
                              onClick={() => setCancelTarget(r)}
                            >
                              <XCircle className="text-red-600" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPage} · {meta.total} requests
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPage}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
