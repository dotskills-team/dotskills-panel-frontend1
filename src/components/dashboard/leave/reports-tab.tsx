"use client";
import { FinanceStatCard } from "@/components/dashboard/my-finance/FinanceStatCard";

import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, BarChart3, CalendarDays, FileSpreadsheet, FileText, Loader2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { leaveApi } from "@/features/leave/api/leave.api";
import { useLeaveReport } from "@/features/leave/hooks/use-leave";
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import { LEAVE_TYPE_LABEL, LEAVE_TYPE_OPTIONS } from "@/features/leave/constants/leave.constant";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const fmt = (n: number) => (n === 0 ? "–" : Number.isInteger(n) ? String(n) : n.toFixed(1));

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ReportsTab() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState<number | undefined>(now.getMonth() + 1);
  const [staff, setStaff] = useState<string>("all");
  const [exporting, setExporting] = useState<"xlsx" | "pdf" | null>(null);

  const staffFilter = staff === "all" ? undefined : staff;
  const users = useAssignableUsers();
  const { data, isLoading, isError, error } = useLeaveReport(year, month, staffFilter);
  const report = data?.data;

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  const download = async (format: "xlsx" | "pdf") => {
    setExporting(format);
    try {
      const blob = await leaveApi.exportReport(year, month, format, staffFilter);
      const suffix = month ? `${year}-${String(month).padStart(2, "0")}` : String(year);
      saveBlob(blob, `leave-report-${suffix}.${format}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(null);
    }
  };

  const extraByType = report
    ? LEAVE_TYPE_OPTIONS.map((o) => ({ ...o, extra: report.totals.byType[o.value]?.extraDays ?? 0 })).filter(
        (t) => t.extra > 0,
      )
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={month ? String(month) : "year"}
          onValueChange={(v) => setMonth(v === "year" ? undefined : Number(v))}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Whole year</SelectItem>
            {MONTHS.map((m, i) => (
              <SelectItem key={m} value={String(i + 1)}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={staff} onValueChange={setStaff} disabled={users.isLoading}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All staff" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All staff</SelectItem>
            {(users.data?.data ?? []).map((u) => (
              <SelectItem key={u._id} value={u._id}>
                {u.firstName} {u.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" disabled={exporting !== null} onClick={() => download("xlsx")}>
            {exporting === "xlsx" ? <Loader2 className="animate-spin" /> : <FileSpreadsheet />}
            Excel
          </Button>
          <Button variant="outline" disabled={exporting !== null} onClick={() => download("pdf")}>
            {exporting === "pdf" ? <Loader2 className="animate-spin" /> : <FileText />}
            PDF
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Unable to load the report."}
        </div>
      ) : isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : !report || report.rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <BarChart3 className="text-muted-foreground" />
          <div>
            <p className="font-medium">No approved leave</p>
            <p className="text-sm text-muted-foreground">
              {staffFilter ? "This person took no leave" : "Nothing was taken"} in{" "}
              {report?.periodLabel ?? "this period"}.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <FinanceStatCard title="Leave days" value={fmt(report.totals.totalDays)} caption="Leave days taken" icon={CalendarDays} tone="text-blue-100" gradient="from-blue-600 via-indigo-600 to-violet-600" />
            <FinanceStatCard title="Extra days" value={fmt(report.totals.extraDays)} caption="Over-balance days" icon={AlertTriangle} tone="text-rose-100" gradient="from-rose-500 via-pink-600 to-fuchsia-600" />
            <FinanceStatCard title="Staff" value={String(report.rows.length)} caption="Staff with leave" icon={Users} tone="text-violet-100" gradient="from-violet-600 via-purple-600 to-fuchsia-700" />
          </div>

          {extraByType.length > 0 && (
            <Card>
              <CardContent className="space-y-2 p-4">
                <p className="text-sm font-medium">Extra leave by type</p>
                <div className="flex flex-wrap gap-2">
                  {extraByType.map((t) => (
                    <span
                      key={t.value}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-700"
                    >
                      {t.label}: {fmt(t.extra)}d
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="overflow-hidden p-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-sm">
                  <thead>
                    <tr className="border-b bg-indigo-600 text-left text-xs text-white">
                      <th className="p-3 font-medium">Staff</th>
                      {LEAVE_TYPE_OPTIONS.map((o) => (
                        <th key={o.value} className="p-3 text-right font-medium">
                          {LEAVE_TYPE_LABEL[o.value].replace(" leave", "")}
                        </th>
                      ))}
                      <th className="p-3 text-right font-medium">Total</th>
                      <th className="p-3 text-right font-medium">Extra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.map((r) => (
                      <tr key={r.staffId} className="border-b hover:bg-muted/30">
                        <td className="p-3">
                          <p className="font-medium">{r.name}</p>
                          {r.department && <p className="text-xs text-muted-foreground">{r.department}</p>}
                        </td>
                        {LEAVE_TYPE_OPTIONS.map((o) => {
                          const f = r.byType[o.value];
                          return (
                            <td key={o.value} className="p-3 text-right tabular-nums">
                              {fmt(f?.days ?? 0)}
                              {(f?.extraDays ?? 0) > 0 && (
                                <span className="ml-1 text-[11px] text-red-600">(+{fmt(f.extraDays)})</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="p-3 text-right font-semibold tabular-nums">{fmt(r.totalDays)}</td>
                        <td className="p-3 text-right font-semibold tabular-nums text-red-600">
                          {fmt(r.extraDays)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/40 font-semibold">
                      <td className="p-3">Total</td>
                      {LEAVE_TYPE_OPTIONS.map((o) => (
                        <td key={o.value} className="p-3 text-right tabular-nums">
                          {fmt(report.totals.byType[o.value]?.days ?? 0)}
                        </td>
                      ))}
                      <td className="p-3 text-right tabular-nums">{fmt(report.totals.totalDays)}</td>
                      <td className="p-3 text-right tabular-nums text-red-600">{fmt(report.totals.extraDays)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">
            Approved requests are counted in the month they start. Figures in red brackets are extra days.
          </p>
        </>
      )}
    </div>
  );
}
