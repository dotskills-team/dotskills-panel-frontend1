"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock, Coffee, Loader2, LogIn, LogOut, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import {
  useAttendanceToday,
  useCheckIn,
  useCheckOut,
  useEndBreak,
  useStartBreak,
} from "@/features/attendance/hooks/use-attendance";
import {
  formatDay,
  formatDuration,
  formatTime,
  liveBreakSeconds,
  liveWorkSeconds,
  toDhakaDay,
} from "@/features/attendance/utils/attendance.utils";
import { cn } from "@/lib/utils";
import type { AttendanceState } from "@/types/attendance.types";

const STATE_BADGE: Record<AttendanceState, { label: string; className: string }> = {
  "not-started": { label: "Not started", className: "border-slate-200 bg-slate-50 text-slate-600" },
  working: { label: "Working", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  "on-break": { label: "On break", className: "border-amber-200 bg-amber-50 text-amber-700" },
  "checked-out": { label: "Checked out", className: "border-indigo-200 bg-indigo-50 text-indigo-700" },
};

/** Re-renders every second while `active`, so the timer keeps running. */
function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

const errMsg = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

/** Today's attendance: current state, check-in time, live total and the action buttons. */
export function AttendanceCard() {
  const { data, isLoading, isError, error, refetch } = useAttendanceToday();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const startBreak = useStartBreak();
  const endBreak = useEndBreak();
  const [confirmOut, setConfirmOut] = useState(false);

  const today = data?.data;
  const state: AttendanceState = today?.state ?? "not-started";
  const record = today?.record ?? null;
  const ticking = state === "working" || state === "on-break";

  const now = useNow(ticking);
  // Follow the server clock rather than the device clock.
  const serverNow = now + (data?.clockOffsetMs ?? 0);

  const busy = checkIn.isPending || checkOut.isPending || startBreak.isPending || endBreak.isPending;

  const run = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action();
      toast.success(success);
    } catch (e) {
      toast.error(errMsg(e, "Something went wrong"));
    }
  };

  if (isLoading) return <Skeleton className="h-44 w-full rounded-xl" />;

  if (isError || !today) {
    return (
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm">
          <span className="text-destructive">{errMsg(error, "Unable to load today's attendance.")}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const workSeconds = record ? liveWorkSeconds(record, serverNow) : 0;
  const breakSeconds = record ? liveBreakSeconds(record, serverNow) : 0;
  const badge = STATE_BADGE[state];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 to-violet-500" />
      <ConfirmDialog
        open={confirmOut}
        onOpenChange={setConfirmOut}
        title="Check out for today?"
        description="You will not be able to check in again today. A running break is ended automatically."
        confirmText="Check out"
        isLoading={checkOut.isPending}
        onConfirm={async () => {
          await run(() => checkOut.mutateAsync(), "Checked out");
          setConfirmOut(false);
        }}
      />

      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Clock className="size-4 text-indigo-600" aria-hidden="true" /> Attendance
            <span className="font-normal text-muted-foreground">
              · {formatDay(toDhakaDay(today.serverTime))}
            </span>
          </p>
          <Badge variant="outline" className={cn(badge.className)}>
            {badge.label}
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <p className="text-xs text-muted-foreground">Today&apos;s total</p>
            <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums">
              {formatDuration(Math.floor(workSeconds / 60))}
              {ticking && (
                <span className="ml-1.5 text-base font-medium text-muted-foreground">
                  {String(workSeconds % 60).padStart(2, "0")}s
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Checked in</p>
            <p className="mt-1 text-xl font-semibold">{formatTime(record?.checkIn)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Break time</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatDuration(Math.floor(breakSeconds / 60))}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {state === "not-started" && (
            <Button disabled={busy} onClick={() => run(() => checkIn.mutateAsync(), "Checked in")}>
              {checkIn.isPending ? <Loader2 className="animate-spin" /> : <LogIn />}
              Check In
            </Button>
          )}

          {state === "working" && (
            <>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => run(() => startBreak.mutateAsync(), "Break started")}
              >
                {startBreak.isPending ? <Loader2 className="animate-spin" /> : <Coffee />}
                Start Break
              </Button>
              <Button variant="destructive" disabled={busy} onClick={() => setConfirmOut(true)}>
                <LogOut />
                Check Out
              </Button>
            </>
          )}

          {state === "on-break" && (
            <Button disabled={busy} onClick={() => run(() => endBreak.mutateAsync(), "Break ended")}>
              {endBreak.isPending ? <Loader2 className="animate-spin" /> : <Play />}
              End Break
            </Button>
          )}

          {state === "checked-out" && (
            <p className="text-sm text-muted-foreground">
              You checked out at {formatTime(record?.checkOut)}. See you tomorrow.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
