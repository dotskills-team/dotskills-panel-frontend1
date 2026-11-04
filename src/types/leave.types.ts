export type LeaveType =
  | "casual"
  | "sick"
  | "annual"
  | "emergency"
  | "unpaid"
  | "early_leave"
  | "late_arrival"
  | "half_day";

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type HalfDaySession = "morning" | "afternoon";
export type ExtraLeaveType = "unpaid" | "advance" | "waived";

export interface LeaveUserRef {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  role?: string;
  designation?: string;
  department?: string;
  avatar?: string;
}

export interface LeaveTimelineEntry {
  action: string;
  by: LeaveUserRef | string;
  at: string;
  note?: string;
}

export interface LeaveRecommendation {
  by: LeaveUserRef | string;
  note: string;
  at: string;
}

export interface ILeaveRequest {
  _id: string;
  staff: LeaveUserRef;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  halfDaySession?: HalfDaySession;
  leaveTime?: string;
  expectedArrivalTime?: string;
  reason?: string;
  emergencyContact?: string;
  attachments: { url: string; name: string }[];
  status: LeaveStatus;
  totalDays: number;
  paidDays: number;
  extraDays: number;
  extraLeaveType?: ExtraLeaveType;
  extraApprovedBy?: LeaveUserRef;
  extraApprovalNote?: string;
  decidedBy?: LeaveUserRef;
  decidedAt?: string;
  decisionNote?: string;
  rejectReason?: string;
  recommendations: LeaveRecommendation[];
  timeline: LeaveTimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ILeaveBalance {
  staff: string;
  year: number;
  totalQuota: number;
  carriedForward: number;
  used: number;
  advanceUsed: number;
  remaining: number;
  extraDays: number;
  pendingCount: number;
  pendingDays: number;
  pendingExtraDays: number;
}

export interface ILeavePolicy {
  annualLeaveQuota: number;
  staffQuotaOverrides: { staff: string; quota: number }[];
  weeklyOffDays: number[];
  publicHolidays: { date: string; name: string }[];
  minAdvanceNoticeDays: number;
  allowPastDateRequestsAdminOnly: boolean;
  yearEndRule: "reset" | "carry_forward";
  carryForwardMax: number;
  defaultExtraLeaveType: ExtraLeaveType;
  maxExtraDaysWarning: number;
  pendingReminderAfterDays: number;
}

export interface ILeavePreview {
  totalDays: number;
  paidDays: number;
  extraDays: number;
  remaining: number;
  warning: string | null;
}

/* ----------------------- calendar, conflicts, summary ---------------------- */

export interface ILeaveCalendarEntry {
  _id: string;
  staff: { _id: string; name: string; department: string | null };
  startDate: string;
  endDate: string;
  halfDaySession: HalfDaySession | null;
  /** Over-balance leave. Shown in a different colour. */
  isExtra: boolean;
  // Only present for managers and admins:
  leaveType?: LeaveType;
  status?: LeaveStatus;
  totalDays?: number;
  extraDays?: number;
}

export interface ILeaveCalendar {
  from: string;
  to: string;
  entries: ILeaveCalendarEntry[];
  weeklyOffDays: number[];
  publicHolidays: { date: string; name: string }[];
}

export interface ILeaveConflicts {
  days: { date: string; count: number; people: string[] }[];
  maxCount: number;
  peopleCount: number;
}

export interface ILeaveDashboardSummary {
  personal: {
    balance: { totalQuota: number; used: number; remaining: number; extraDays: number };
    nextLeave: {
      leaveType: LeaveType;
      startDate: string;
      endDate: string;
      totalDays: number;
      extraDays: number;
    } | null;
    pendingCount: number;
  } | null;
  team: {
    onLeaveToday: {
      staffId: string;
      name: string;
      department: string | null;
      leaveType: LeaveType;
      until: string;
      halfDaySession: HalfDaySession | null;
      isExtra: boolean;
    }[];
    pendingApprovals: number;
    topLeaveTakers: { staffId: string; name: string; totalDays: number; requests: number }[];
  } | null;
}

/* ------------------------------ reports, audit ----------------------------- */

export interface ILeaveTypeFigures {
  days: number;
  extraDays: number;
  count: number;
}

export interface ILeaveReportRow {
  staffId: string;
  name: string;
  department: string | null;
  byType: Record<string, ILeaveTypeFigures>;
  totalDays: number;
  extraDays: number;
}

export interface ILeaveReport {
  year: number;
  month: number | null;
  periodLabel: string;
  rows: ILeaveReportRow[];
  totals: { byType: Record<string, ILeaveTypeFigures>; totalDays: number; extraDays: number };
}

export interface ILeaveAuditLog {
  _id: string;
  action: string;
  performedBy: { _id: string; firstName?: string; lastName?: string; role?: string } | null;
  targetStaff?: { _id: string; firstName?: string; lastName?: string } | null;
  targetRequest?: string;
  before?: unknown;
  after?: unknown;
  note?: string;
  createdAt: string;
}
