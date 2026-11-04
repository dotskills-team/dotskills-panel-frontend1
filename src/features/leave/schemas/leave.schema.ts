import { z } from "zod";

const dayString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date");
const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm");

const leaveTypeEnum = z.enum([
  "casual",
  "sick",
  "annual",
  "emergency",
  "unpaid",
  "early_leave",
  "late_arrival",
  "half_day",
]);

/** Fields shared by the request form and the admin create/edit forms. */
const leaveFieldsBase = z.object({
  leaveType: leaveTypeEnum,
  startDate: dayString,
  endDate: z.string().optional(),
  halfDaySession: z.enum(["morning", "afternoon"]).optional(),
  leaveTime: z.string().optional(),
  expectedArrivalTime: z.string().optional(),
  reason: z.string().trim().min(3, "Please give a short reason").max(1000),
  emergencyContact: z.string().trim().max(100).optional(),
  attachments: z.array(z.object({ url: z.string().url(), name: z.string() })).max(5),
});

type LeaveFieldValues = z.infer<typeof leaveFieldsBase>;
type Issue = { path: string; message: string };

/** Type-specific rules, returned as issues so every form schema can reuse them. */
function leaveFieldIssues(v: LeaveFieldValues): Issue[] {
  const issues: Issue[] = [];
  if (v.leaveType === "half_day" && !v.halfDaySession) {
    issues.push({ path: "halfDaySession", message: "Choose morning or afternoon" });
  }
  if (v.leaveType === "early_leave" && !timeString.safeParse(v.leaveTime).success) {
    issues.push({ path: "leaveTime", message: "Enter the leave time" });
  }
  if (v.leaveType === "late_arrival" && !timeString.safeParse(v.expectedArrivalTime).success) {
    issues.push({ path: "expectedArrivalTime", message: "Enter the arrival time" });
  }
  const multiDay = !["half_day", "early_leave", "late_arrival"].includes(v.leaveType);
  if (multiDay && v.endDate && v.endDate < v.startDate) {
    issues.push({ path: "endDate", message: "End date is before start date" });
  }
  return issues;
}

export const leaveRequestSchema = leaveFieldsBase.superRefine((v, ctx) => {
  for (const i of leaveFieldIssues(v)) ctx.addIssue({ code: "custom", path: [i.path], message: i.message });
});

export type LeaveRequestFormValues = z.infer<typeof leaveRequestSchema>;

/* ------------------------------ decisions ---------------------------------- */

export const rejectSchema = z.object({
  reason: z.string().trim().min(3, "A rejection reason is required").max(500),
});

export const extraApprovalSchema = z.object({
  extraLeaveType: z.enum(["unpaid", "advance", "waived"], {
    message: "Choose how to treat the extra days",
  }),
  extraApprovalNote: z.string().trim().min(3, "A comment is required").max(500),
});

export const recommendSchema = z.object({
  note: z.string().trim().min(3, "Please write a comment").max(500),
});

/* ------------------------------ admin forms -------------------------------- */

const extraDecisionFields = {
  extraLeaveType: z.enum(["unpaid", "advance", "waived"]).optional(),
  extraApprovalNote: z.string().trim().max(500).optional(),
};

export const adminCreateSchema = leaveFieldsBase
  .extend({
    staffId: z.string().min(1, "Choose a staff member"),
    autoApprove: z.boolean(),
    ...extraDecisionFields,
  })
  .superRefine((v, ctx) => {
    for (const i of leaveFieldIssues(v)) ctx.addIssue({ code: "custom", path: [i.path], message: i.message });
    // The server decides whether the request is over balance; if it is, both are required.
    if (v.extraLeaveType && !v.extraApprovalNote?.trim()) {
      ctx.addIssue({ code: "custom", path: ["extraApprovalNote"], message: "A comment is required" });
    }
  });
export type AdminCreateFormValues = z.infer<typeof adminCreateSchema>;

export const adminEditSchema = leaveFieldsBase
  .omit({ attachments: true })
  .extend({
    note: z.string().trim().max(500).optional(),
    ...extraDecisionFields,
  })
  .superRefine((v, ctx) => {
    for (const i of leaveFieldIssues({ ...v, attachments: [] })) {
      ctx.addIssue({ code: "custom", path: [i.path], message: i.message });
    }
    if (v.extraLeaveType && !v.extraApprovalNote?.trim()) {
      ctx.addIssue({ code: "custom", path: ["extraApprovalNote"], message: "A comment is required" });
    }
  });
export type AdminEditFormValues = z.infer<typeof adminEditSchema>;

export const adjustBalanceSchema = z.object({
  staffId: z.string().min(1, "Choose a staff member"),
  field: z.enum(["totalQuota", "carriedForward"]),
  amount: z
    .number({ message: "Enter an amount" })
    .refine((n) => n !== 0, "Amount cannot be zero")
    .refine((n) => Math.abs(n * 2) % 1 === 0, "Use whole or half days"),
  reason: z.string().trim().min(3, "A reason is required").max(500),
});
export type AdjustBalanceFormValues = z.infer<typeof adjustBalanceSchema>;

export const policySchema = z.object({
  annualLeaveQuota: z.number({ message: "Enter a number" }).min(0).max(365),
  staffQuotaOverrides: z.array(
    z.object({
      staff: z.string().min(1, "Choose a staff member"),
      quota: z.number({ message: "Enter a number" }).min(0).max(365),
    }),
  ),
  weeklyOffDays: z.array(z.number().int().min(0).max(6)),
  publicHolidays: z.array(
    z.object({ date: dayString, name: z.string().trim().min(1, "Name the holiday").max(100) }),
  ),
  minAdvanceNoticeDays: z.number({ message: "Enter a number" }).int().min(0).max(60),
  allowPastDateRequestsAdminOnly: z.boolean(),
  yearEndRule: z.enum(["reset", "carry_forward"]),
  carryForwardMax: z.number({ message: "Enter a number" }).min(0).max(365),
  defaultExtraLeaveType: z.enum(["unpaid", "advance", "waived"]),
  maxExtraDaysWarning: z.number({ message: "Enter a number" }).min(0).max(365),
  pendingReminderAfterDays: z.number({ message: "Enter a number" }).int().min(1).max(60),
});
export type PolicyFormValues = z.infer<typeof policySchema>;

export interface LeaveListQuery {
  page?: number;
  limit?: number;
  status?: string;
  leaveType?: string;
  staff?: string;
  from?: string;
  to?: string;
  extraOnly?: "true" | "false";
  mine?: "true" | "false";
  sort?: string;
}
