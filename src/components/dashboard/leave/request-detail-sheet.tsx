"use client";

import { Paperclip } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLeaveRequest } from "@/features/leave/hooks/use-leave";
import { LEAVE_TYPE_LABEL } from "@/features/leave/constants/leave.constant";
import {
  ExtraLeaveBadge,
  LeaveStatusBadge,
  formatDateRange,
  formatDateTime,
  userName,
} from "./leave-badges";

const ACTION_LABEL: Record<string, string> = {
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
  edited: "Edited",
  recommended: "Recommendation added",
  auto_approved: "Auto-approved",
  created_on_behalf: "Added by admin",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}

export function RequestDetailSheet({
  requestId,
  onOpenChange,
}: {
  requestId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, isLoading, isError, error } = useLeaveRequest(requestId ?? undefined);
  const r = data?.data;

  return (
    <Sheet open={Boolean(requestId)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Leave request</SheetTitle>
          <SheetDescription>{r ? userName(r.staff) : "Loading…"}</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error instanceof Error ? error.message : "Unable to load request"}
            </div>
          ) : r ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <LeaveStatusBadge status={r.status} />
                <ExtraLeaveBadge days={r.extraDays} />
              </div>

              <div className="divide-y rounded-lg border px-3">
                <Row label="Type">{LEAVE_TYPE_LABEL[r.leaveType]}</Row>
                <Row label="Dates">{formatDateRange(r.startDate, r.endDate)}</Row>
                {r.halfDaySession && <Row label="Session">{r.halfDaySession}</Row>}
                {r.leaveTime && <Row label="Leave time">{r.leaveTime}</Row>}
                {r.expectedArrivalTime && <Row label="Arrival time">{r.expectedArrivalTime}</Row>}
                <Row label="Total days">{r.totalDays}</Row>
                <Row label="From balance">{r.paidDays}</Row>
                <Row label="Extra days">{r.extraDays}</Row>
                {r.extraLeaveType && <Row label="Extra treated as">{r.extraLeaveType}</Row>}
              </div>

              {r.reason && (
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Reason</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{r.reason}</p>
                </div>
              )}
              {r.emergencyContact && (
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Emergency contact</p>
                  <p className="mt-1 text-sm">{r.emergencyContact}</p>
                </div>
              )}
              {r.rejectReason && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <p className="font-medium">Rejected</p>
                  <p>{r.rejectReason}</p>
                </div>
              )}
              {r.extraApprovalNote && (
                <div className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">Extra leave decision · {userName(r.extraApprovedBy)}</p>
                  <p className="text-muted-foreground">{r.extraApprovalNote}</p>
                </div>
              )}

              {r.attachments.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Attachments</p>
                  {r.attachments.map((a) => (
                    <a
                      key={a.url}
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                    >
                      <Paperclip className="size-3.5" />
                      {a.name}
                    </a>
                  ))}
                </div>
              )}

              {r.recommendations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Recommendations</p>
                  {r.recommendations.map((rec, i) => (
                    <div key={i} className="rounded-lg border p-3 text-sm">
                      <p className="font-medium">{userName(rec.by)}</p>
                      <p className="text-muted-foreground">{rec.note}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Timeline</p>
                <ol className="relative ml-2 space-y-4 border-l pl-5">
                  {r.timeline.map((t, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[25px] top-1 size-2.5 rounded-full bg-indigo-500" />
                      <p className="text-sm font-medium">
                        {ACTION_LABEL[t.action] ?? t.action}
                        <span className="font-normal text-muted-foreground"> · {userName(t.by)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(t.at)}</p>
                      {t.note && <p className="mt-0.5 text-sm">{t.note}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
