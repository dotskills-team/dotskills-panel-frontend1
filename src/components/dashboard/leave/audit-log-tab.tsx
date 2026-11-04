"use client";

import { useState } from "react";
import { ScrollText } from "lucide-react";

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
import { useLeaveAuditLogs } from "@/features/leave/hooks/use-leave";
import { formatDateTime } from "./leave-badges";

const ACTIONS: Record<string, string> = {
  request_edited: "Request edited",
  balance_adjusted: "Balance adjusted",
  extra_leave_decision: "Extra leave decision",
  created_on_behalf: "Added for staff",
  policy_updated: "Policy updated",
};

const nameOf = (u?: { firstName?: string; lastName?: string } | null) =>
  u ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—" : "—";

export function AuditLogTab() {
  const [action, setAction] = useState("ALL");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useLeaveAuditLogs({
    page,
    limit: 15,
    action: action === "ALL" ? undefined : action,
  });
  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={action}
        onValueChange={(v) => {
          setAction(v);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All actions</SelectItem>
          {Object.entries(ACTIONS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          {isError ? (
            <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error instanceof Error ? error.message : "Unable to load the audit log."}
            </div>
          ) : isLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="m-4 flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <ScrollText className="text-muted-foreground" />
              <p className="font-medium">No audit entries</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-170 text-sm">
                <thead>
                  <tr className="border-b bg-indigo-600 text-left text-xs text-white">
                    <th className="p-3 font-medium">When</th>
                    <th className="p-3 font-medium">Action</th>
                    <th className="p-3 font-medium">By</th>
                    <th className="p-3 font-medium">Staff</th>
                    <th className="p-3 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r._id} className="border-b align-top last:border-0 hover:bg-muted/30">
                      <td className="p-3 whitespace-nowrap">{formatDateTime(r.createdAt)}</td>
                      <td className="p-3 font-medium">{ACTIONS[r.action] ?? r.action}</td>
                      <td className="p-3">{nameOf(r.performedBy)}</td>
                      <td className="p-3">{nameOf(r.targetStaff)}</td>
                      <td className="max-w-xs p-3 text-muted-foreground">{r.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPage}
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
