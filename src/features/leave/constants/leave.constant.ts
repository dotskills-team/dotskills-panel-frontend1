import type { ExtraLeaveType, LeaveStatus, LeaveType } from "@/types/leave.types";

export const LEAVE_TYPE_OPTIONS: { value: LeaveType; label: string }[] = [
  { value: "casual", label: "Casual leave" },
  { value: "sick", label: "Sick leave" },
  { value: "annual", label: "Annual leave" },
  { value: "emergency", label: "Emergency leave" },
  { value: "unpaid", label: "Unpaid leave" },
  { value: "half_day", label: "Half day" },
  { value: "early_leave", label: "Early leave" },
  { value: "late_arrival", label: "Late arrival" },
];

export const LEAVE_TYPE_LABEL = Object.fromEntries(
  LEAVE_TYPE_OPTIONS.map((o) => [o.value, o.label]),
) as Record<LeaveType, string>;

export const LEAVE_STATUS_OPTIONS: { value: LeaveStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export const EXTRA_LEAVE_OPTIONS: { value: ExtraLeaveType; label: string; hint: string }[] = [
  { value: "unpaid", label: "Unpaid", hint: "Extra days are counted as unpaid leave." },
  { value: "advance", label: "Advance", hint: "Extra days are deducted from next year's quota." },
  { value: "waived", label: "Waived", hint: "No deduction, recorded only." },
];

/** Types tied to a single date. */
export const SINGLE_DAY_TYPES: LeaveType[] = ["half_day", "early_leave", "late_arrival"];
/** Types that are records only (no days counted, no balance used). */
export const RECORD_ONLY_TYPES: LeaveType[] = ["early_leave", "late_arrival"];

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];
export const APPROVER_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER"];
