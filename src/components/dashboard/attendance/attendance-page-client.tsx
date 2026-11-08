"use client";

import { BarChart3, CalendarDays, Clock, ListChecks, type LucideIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATTENDANCE_MANAGER_ROLES } from "@/features/attendance/utils/attendance.utils";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";

import { AttendanceCard } from "./attendance-card";
import { AttendanceRecordsTab } from "./attendance-records-tab";
import { AttendanceSummaryTab } from "./attendance-summary-tab";
import { MyAttendanceTab } from "./my-attendance-tab";

function Tab({ value, icon: Icon, label }: { value: string; icon: LucideIcon; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "h-10 min-h-10 min-w-fit gap-2 rounded-lg px-4 py-0 text-sm",
        "data-active:bg-indigo-600 data-active:text-white data-active:shadow-md",
        "dark:data-active:bg-indigo-600 dark:data-active:text-white",
      )}
    >
      <Icon aria-hidden="true" />
      <span>{label}</span>
    </TabsTrigger>
  );
}

export function AttendancePageClient() {
  const role = useAuthStore((s) => s.user?.role) as string | undefined;
  const isManager = Boolean(role && ATTENDANCE_MANAGER_ROLES.includes(role));

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
          <Clock className="size-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {isManager
              ? "Check in and out, and review or correct your team's attendance."
              : "Check in, take breaks and track your working hours."}
          </p>
        </div>
      </div>

      <AttendanceCard />

      <Tabs defaultValue="mine" className="w-full gap-5">
        <div className="w-full overflow-x-auto rounded-xl border bg-card p-1 shadow-sm">
          <TabsList className="flex h-auto w-full min-w-max justify-start gap-1 bg-transparent p-0 group-data-horizontal/tabs:h-auto sm:justify-stretch">
            <Tab value="mine" icon={CalendarDays} label="My Attendance" />
            {isManager && <Tab value="records" icon={ListChecks} label="All Records" />}
            {isManager && <Tab value="summary" icon={BarChart3} label="Monthly Summary" />}
          </TabsList>
        </div>

        <TabsContent value="mine">
          <MyAttendanceTab />
        </TabsContent>
        {isManager && (
          <TabsContent value="records">
            <AttendanceRecordsTab />
          </TabsContent>
        )}
        {isManager && (
          <TabsContent value="summary">
            <AttendanceSummaryTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
