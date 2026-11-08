import { z } from "zod";

const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm");

/** Optional time: empty string means "not set". */
const optionalTime = z.string().refine((v) => v === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(v), "Use HH:mm");

/**
 * Admin / manager form for creating or editing a record. All times are Dhaka times on `date`.
 * `requireStaff` is true when creating a record for a staff member.
 */
export const makeAttendanceFormSchema = (requireStaff: boolean) =>
  z
    .object({
      userId: z.string(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
      checkIn: timeString,
      checkOut: optionalTime,
      breaks: z.array(z.object({ start: timeString, end: optionalTime })).max(20),
      editReason: z.string().trim().min(3, "A reason is required").max(500),
    })
    .superRefine((v, ctx) => {
      if (requireStaff && !v.userId) {
        ctx.addIssue({ code: "custom", path: ["userId"], message: "Choose a staff member" });
      }
      // "HH:mm" strings compare correctly as text.
      if (v.checkOut && v.checkOut <= v.checkIn) {
        ctx.addIssue({ code: "custom", path: ["checkOut"], message: "Must be after check-in" });
      }
      v.breaks.forEach((b, i) => {
        if (b.start < v.checkIn) {
          ctx.addIssue({ code: "custom", path: ["breaks", i, "start"], message: "Before check-in" });
        }
        if (b.end && b.end <= b.start) {
          ctx.addIssue({ code: "custom", path: ["breaks", i, "end"], message: "Must be after start" });
        }
        if (v.checkOut && (b.start >= v.checkOut || (b.end && b.end > v.checkOut))) {
          ctx.addIssue({ code: "custom", path: ["breaks", i, "start"], message: "Outside working hours" });
        }
      });
    });

export type AttendanceFormValues = z.infer<ReturnType<typeof makeAttendanceFormSchema>>;

export interface AttendanceListQuery {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  userId?: string;
}
