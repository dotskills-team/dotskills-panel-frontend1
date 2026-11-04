"use client";

import { Users } from "lucide-react";
import { useLeaveConflicts } from "@/features/leave/hooks/use-leave";
import type { ILeaveRequest } from "@/types/leave.types";

/**
 * Warns an approver how many colleagues are already on approved leave on the requested
 * dates, e.g. "3 people already on leave this day". Renders nothing when there is no overlap.
 */
export function ConflictHint({ request }: { request: ILeaveRequest }) {
  const { data } = useLeaveConflicts(
    {
      from: request.startDate.slice(0, 10),
      to: request.endDate.slice(0, 10),
      department: request.staff.department || undefined,
      excludeRequestId: request._id,
    },
    request.status === "pending" && request.leaveType !== "early_leave" && request.leaveType !== "late_arrival",
  );

  const conflicts = data?.data;
  if (!conflicts || conflicts.maxCount === 0) return null;

  const single = request.startDate.slice(0, 10) === request.endDate.slice(0, 10);
  const text = single
    ? `${conflicts.maxCount} ${conflicts.maxCount === 1 ? "person" : "people"} already on leave this day`
    : `Up to ${conflicts.maxCount} ${conflicts.maxCount === 1 ? "person" : "people"} already on leave in this period`;
  const names = Array.from(new Set(conflicts.days.flatMap((d) => d.people))).join(", ");

  return (
    <p
      className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-800"
      title={names}
    >
      <Users className="size-3" />
      {text}
    </p>
  );
}
