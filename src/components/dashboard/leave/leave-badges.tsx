import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeaveStatus, LeaveUserRef } from "@/types/leave.types";

const STATUS_STYLE: Record<LeaveStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  cancelled: "border-slate-200 bg-slate-50 text-slate-600",
};

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize", STATUS_STYLE[status])}>
      {status}
    </Badge>
  );
}

export function ExtraLeaveBadge({ days }: { days: number }) {
  if (!days) return null;
  return (
    <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
      Extra leave · {days}d
    </Badge>
  );
}

export const userName = (u?: LeaveUserRef | string | null) => {
  if (!u) return "—";
  if (typeof u === "string") return u;
  return u.fullName || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email || "—";
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC", // leave dates are calendar days stored at UTC midnight
  });

export const formatDateRange = (start: string, end: string) =>
  start.slice(0, 10) === end.slice(0, 10) ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
