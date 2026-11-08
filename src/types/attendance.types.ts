export type AttendanceState = "not-started" | "working" | "on-break" | "checked-out";

export interface AttendanceUserRef {
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

export interface IAttendanceBreak {
  start: string;
  end: string | null;
}

export interface IAttendance {
  _id: string;
  /** Populated for the admin list; just an id for the staff's own records. */
  user: AttendanceUserRef | string;
  /** Calendar day in Asia/Dhaka, "YYYY-MM-DD". */
  date: string;
  checkIn: string;
  checkOut: string | null;
  breaks: IAttendanceBreak[];
  totalWorkMinutes: number;
  breakMinutes: number;
  isMissingCheckOut: boolean;
  isEdited: boolean;
  state: AttendanceState;
  editedBy: AttendanceUserRef | string | null;
  editReason: string | null;
  editedAt: string | null;
}

export interface IAttendanceToday {
  state: AttendanceState;
  /** Server clock at response time; the live timer is based on it, not on the browser clock. */
  serverTime: string;
  record: IAttendance | null;
}

export interface IAttendanceMonth {
  month: string;
  serverTime: string;
  monthlyTotalMinutes: number;
  daysPresent: number;
  days: IAttendance[];
}

export interface IAttendanceSummaryRow {
  user: AttendanceUserRef;
  totalMinutes: number;
  daysPresent: number;
  missingCheckOutDays: number;
}

export interface IAttendanceSummary {
  month: string;
  staff: IAttendanceSummaryRow[];
}
