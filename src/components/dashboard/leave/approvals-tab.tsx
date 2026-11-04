"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, ClipboardCheck, Eye, MessageSquare, Pencil, Scale, UserPlus, X } from "lucide-react";

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

import { useApproveLeaveRequest, useLeaveRequests } from "@/features/leave/hooks/use-leave";
import {
  ADMIN_ROLES,
  LEAVE_STATUS_OPTIONS,
  LEAVE_TYPE_LABEL,
} from "@/features/leave/constants/leave.constant";
import { useAuthStore } from "@/stores/auth.store";
import type { ILeaveRequest } from "@/types/leave.types";

import { ExtraApprovalDialog, RecommendDialog, RejectDialog } from "./decision-dialogs";
import { RequestDetailSheet } from "./request-detail-sheet";
import { ConflictHint } from "./conflict-hint";
import { AdjustBalanceDialog, CreateForStaffDialog, EditRequestDialog } from "./admin-dialogs";
import { ExtraLeaveBadge, LeaveStatusBadge, formatDateRange, userName } from "./leave-badges";

/** Mirrors the server rule: who may decide whose request. */
function canDecide(viewerRole: string, requesterRole?: string) {
  if (requesterRole === "SUPER_ADMIN") return viewerRole === "SUPER_ADMIN";
  if (requesterRole === "ADMIN" || requesterRole === "MANAGER") return ADMIN_ROLES.includes(viewerRole);
  return true;
}

export function ApprovalsTab() {
  const viewerRole = useAuthStore((s) => s.user?.role) as string | undefined;
  const isAdmin = Boolean(viewerRole && ADMIN_ROLES.includes(viewerRole));

  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<ILeaveRequest | null>(null);
  const [extraTarget, setExtraTarget] = useState<ILeaveRequest | null>(null);
  const [recommending, setRecommending] = useState<ILeaveRequest | null>(null);
  const [editing, setEditing] = useState<ILeaveRequest | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);

  const list = useLeaveRequests({
    page,
    limit: 10,
    status: status === "ALL" ? undefined : status,
    mine: "false", // you cannot decide your own request
    sort: status === "pending" ? "startDate" : "-createdAt",
  });
  const approve = useApproveLeaveRequest();

  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;

  const quickApprove = async (r: ILeaveRequest) => {
    try {
      await approve.mutateAsync({ id: r._id, payload: {} });
      toast.success("Request approved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to approve request");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <RequestDetailSheet requestId={viewing} onOpenChange={(o) => !o && setViewing(null)} />
      <RejectDialog request={rejecting} onOpenChange={(o) => !o && setRejecting(null)} />
      <ExtraApprovalDialog request={extraTarget} onOpenChange={(o) => !o && setExtraTarget(null)} />
      <RecommendDialog request={recommending} onOpenChange={(o) => !o && setRecommending(null)} />
      <EditRequestDialog request={editing} onOpenChange={(o) => !o && setEditing(null)} />
      <CreateForStaffDialog open={createOpen} onOpenChange={setCreateOpen} />
      <AdjustBalanceDialog open={adjustOpen} onOpenChange={setAdjustOpen} />

      <div className="flex items-center gap-2">
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
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

        {isAdmin && (
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setAdjustOpen(true)}>
              <Scale /> Adjust balance
            </Button>
            <Button className="bg-indigo-600 text-white hover:bg-indigo-500" onClick={() => setCreateOpen(true)}>
              <UserPlus /> Add leave for staff
            </Button>
          </div>
        )}
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
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="m-4 flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <ClipboardCheck className="text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {status === "pending" ? "Nothing waiting for approval" : "No requests found"}
                </p>
                <p className="text-sm text-muted-foreground">New requests will show up here.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-sm">
                <thead>
                  <tr className="border-b bg-indigo-600 text-left text-xs text-white">
                    <th className="p-3 font-medium">Staff</th>
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium">Dates</th>
                    <th className="p-3 font-medium">Days</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const pending = r.status === "pending";
                    const allowed = canDecide(viewerRole ?? "", r.staff.role);
                    const overBalance = r.extraDays > 0;
                    return (
                      <tr key={r._id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-3">
                          <p className="font-medium">{userName(r.staff)}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.staff.designation || r.staff.role}
                          </p>
                        </td>
                        <td className="p-3">{LEAVE_TYPE_LABEL[r.leaveType]}</td>
                        <td className="p-3">
                          {formatDateRange(r.startDate, r.endDate)}
                          {pending && <ConflictHint request={r} />}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span>{r.totalDays}</span>
                            <ExtraLeaveBadge days={r.extraDays} />
                            {r.recommendations.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="size-3" />
                                {r.recommendations.length}
                              </span>
                            )}
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
                            {(pending || r.status === "approved") && allowed && (
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Edit request"
                                onClick={() => setEditing(r)}
                              >
                                <Pencil />
                              </Button>
                            )}

                            {pending && allowed && (
                              <>
                                {/* Over-balance: admins decide with a type + comment, managers can only recommend. */}
                                {overBalance && !isAdmin ? (
                                  <Button size="sm" variant="outline" onClick={() => setRecommending(r)}>
                                    <MessageSquare /> Recommend
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 text-white hover:bg-emerald-500"
                                    disabled={approve.isPending}
                                    onClick={() => (overBalance ? setExtraTarget(r) : quickApprove(r))}
                                  >
                                    <Check /> Approve
                                  </Button>
                                )}
                                {(isAdmin || !overBalance) && (
                                  <Button size="sm" variant="destructive" onClick={() => setRejecting(r)}>
                                    <X /> Reject
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
