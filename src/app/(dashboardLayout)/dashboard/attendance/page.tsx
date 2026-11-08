import { AttendancePageClient } from "@/components/dashboard/attendance/attendance-page-client";

export const metadata = {
  title: "Attendance | DotSkills Panel",
  description: "Check in, breaks and working hours.",
};

export default function AttendancePage() {
  return <AttendancePageClient />;
}
