import type { AttendanceUserRef, IAttendance } from "@/types/attendance.types";

/** Asia/Dhaka is UTC+6 all year (no daylight saving), matching the backend. */
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;
const TIMEZONE = "Asia/Dhaka";

export const ATTENDANCE_MANAGER_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

/** "Xh Ym" */
export function formatDuration(minutes: number | null | undefined): string {
  const total = Math.max(0, Math.floor(minutes ?? 0));
  return `${Math.floor(total / 60)}h ${total % 60}m`;
}

/** "10:05 AM" in Dhaka time, or "—". */
export function formatTime(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: TIMEZONE,
  });
}

/** "Mon, 03 Nov 2026" from a "YYYY-MM-DD" day string. */
export function formatDay(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Today's day ("YYYY-MM-DD") in Dhaka. */
export const todayInDhaka = (): string =>
  new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });

/** Current month ("YYYY-MM") in Dhaka. */
export const currentMonthInDhaka = (): string => todayInDhaka().slice(0, 7);

/** Dhaka calendar day ("YYYY-MM-DD") of an ISO instant. */
export const toDhakaDay = (iso: string): string =>
  new Date(Date.parse(iso) + DHAKA_OFFSET_MS).toISOString().slice(0, 10);

/** "HH:mm" in Dhaka for an ISO instant (used to fill the edit form). */
export const toDhakaTimeInput = (iso?: string | null): string =>
  iso ? new Date(Date.parse(iso) + DHAKA_OFFSET_MS).toISOString().slice(11, 16) : "";

/** Combines a Dhaka day and "HH:mm" into an ISO instant for the API. */
export const fromDhakaTimeInput = (date: string, time: string): string =>
  new Date(`${date}T${time}:00+06:00`).toISOString();

export const userName = (u?: AttendanceUserRef | string | null): string => {
  if (!u) return "—";
  if (typeof u === "string") return u;
  return u.fullName || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email || "—";
};

/** Seconds spent on breaks up to `nowMs` (a running break counts up to now). */
export function liveBreakSeconds(record: IAttendance, nowMs: number): number {
  const checkIn = Date.parse(record.checkIn);
  const end = record.checkOut ? Date.parse(record.checkOut) : nowMs;
  const ms = record.breaks.reduce((sum, b) => {
    const start = Math.max(Date.parse(b.start), checkIn);
    const stop = Math.min(b.end ? Date.parse(b.end) : end, end);
    return sum + Math.max(0, stop - start);
  }, 0);
  return Math.floor(ms / 1000);
}

/** Seconds worked so far today: closed days use the stored total, open days tick live. */
export function liveWorkSeconds(record: IAttendance, nowMs: number): number {
  if (record.checkOut) return record.totalWorkMinutes * 60;
  const worked = nowMs - Date.parse(record.checkIn) - liveBreakSeconds(record, nowMs) * 1000;
  return Math.max(0, Math.floor(worked / 1000));
}
