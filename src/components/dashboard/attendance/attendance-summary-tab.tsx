"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useAttendanceSummary } from "@/features/attendance/hooks/use-attendance";
import { currentMonthInDhaka, formatDuration, userName } from "@/features/attendance/utils/attendance.utils";

import { MonthPicker } from "./month-picker";

/** Admin / manager monthly summary: total hours and days present for each staff member. */
export function AttendanceSummaryTab() {
  const [month, setMonth] = useState(currentMonthInDhaka);
  const { data, isLoading, isError, error } = useAttendanceSummary(month);
  const rows = data?.data.staff ?? [];

  return (
    <div className="flex flex-col gap-4">
      <MonthPicker value={month} onChange={setMonth} />

      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          {isError ? (
            <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error instanceof Error ? error.message : "Unable to load the summary."}
            </div>
          ) : isLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="m-4 flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <Users className="text-muted-foreground" />
              <p className="font-medium">No staff to show</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 text-sm">
                <thead>
                  <tr className="border-b bg-indigo-600 text-left text-xs text-white">
                    <th className="p-3 font-medium">Staff</th>
                    <th className="p-3 font-medium">Days present</th>
                    <th className="p-3 font-medium">Total hours</th>
                    <th className="p-3 font-medium">Missing check-outs</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.user._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 whitespace-nowrap font-medium">{userName(r.user)}</td>
                      <td className="p-3">{r.daysPresent}</td>
                      <td className="p-3 whitespace-nowrap">{formatDuration(r.totalMinutes)}</td>
                      <td className="p-3">
                        {r.missingCheckOutDays > 0 ? (
                          <span className="font-medium text-red-600 dark:text-red-400">{r.missingCheckOutDays}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
