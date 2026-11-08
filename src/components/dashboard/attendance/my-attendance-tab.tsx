"use client";

import { useState } from "react";
import { CalendarX } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyAttendanceMonth } from "@/features/attendance/hooks/use-attendance";
import {
  currentMonthInDhaka,
  formatDay,
  formatDuration,
  formatTime,
} from "@/features/attendance/utils/attendance.utils";

import { AttendanceFlags } from "./attendance-badges";
import { MonthPicker } from "./month-picker";

/** The signed-in user's own days for a month, with the month's total at the top. */
export function MyAttendanceTab() {
  const [month, setMonth] = useState(currentMonthInDhaka);
  const { data, isLoading, isError, error } = useMyAttendanceMonth(month);
  const report = data?.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Total this month</p>
          <p className="text-3xl font-bold tracking-tight tabular-nums">
            {formatDuration(report?.monthlyTotalMinutes)}
          </p>
          <p className="text-xs text-muted-foreground">{report?.daysPresent ?? 0} day(s) present</p>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          {isError ? (
            <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error instanceof Error ? error.message : "Unable to load attendance."}
            </div>
          ) : isLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !report || report.days.length === 0 ? (
            <div className="m-4 flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <CalendarX className="text-muted-foreground" />
              <p className="font-medium">No attendance this month</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-170 text-sm">
                <thead>
                  <tr className="border-b bg-indigo-600 text-left text-xs text-white">
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">In</th>
                    <th className="p-3 font-medium">Out</th>
                    <th className="p-3 font-medium">Break</th>
                    <th className="p-3 font-medium">Total</th>
                    <th className="p-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {report.days.map((d) => (
                    <tr key={d._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 whitespace-nowrap font-medium">{formatDay(d.date)}</td>
                      <td className="p-3 whitespace-nowrap">{formatTime(d.checkIn)}</td>
                      <td className="p-3 whitespace-nowrap">{formatTime(d.checkOut)}</td>
                      <td className="p-3 whitespace-nowrap">{formatDuration(d.breakMinutes)}</td>
                      <td className="p-3 whitespace-nowrap font-medium">{formatDuration(d.totalWorkMinutes)}</td>
                      <td className="p-3">
                        <AttendanceFlags record={d} />
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
