"use client";

import { useState } from "react";
import { CalendarX, Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAttendanceList } from "@/features/attendance/hooks/use-attendance";
import {
  formatDay,
  formatDuration,
  formatTime,
  userName,
} from "@/features/attendance/utils/attendance.utils";
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import type { IAttendance } from "@/types/attendance.types";

import { AttendanceFlags } from "./attendance-badges";
import { AttendanceFormDialog } from "./attendance-form-dialog";

/** Admin / manager view of everyone's records, with date range and staff filters. */
export function AttendanceRecordsTab() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [staff, setStaff] = useState("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IAttendance | null>(null);

  const users = useAssignableUsers();
  const { data, isLoading, isError, error } = useAttendanceList({
    page,
    limit: 15,
    from: from || undefined,
    to: to || undefined,
    userId: staff === "all" ? undefined : staff,
  });
  const rows = data?.data ?? [];
  const meta = data?.meta;
  const people = users.data?.data ?? [];
  const selectedPerson = people.find((p) => p._id === staff);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (record: IAttendance) => {
    setEditing(record);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <AttendanceFormDialog open={formOpen} onOpenChange={setFormOpen} record={editing} />

      <div className="flex flex-wrap items-end gap-3">
        <div className="grid gap-1.5">
          <label htmlFor="att-from" className="text-xs text-muted-foreground">
            From
          </label>
          <Input
            id="att-from"
            type="date"
            className="w-40"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="att-to" className="text-xs text-muted-foreground">
            To
          </label>
          <Input
            id="att-to"
            type="date"
            className="w-40"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">Staff</span>
          <Select
            value={staff}
            onValueChange={(v) => {
              setStaff(v ?? "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-52" aria-label="Staff">
              <SelectValue>
                {selectedPerson ? `${selectedPerson.firstName} ${selectedPerson.lastName}`.trim() : "All staff"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All staff</SelectItem>
              {people.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {`${p.firstName} ${p.lastName}`.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(from || to || staff !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFrom("");
              setTo("");
              setStaff("all");
              setPage(1);
            }}
          >
            Clear
          </Button>
        )}
        <Button className="ml-auto" onClick={openCreate}>
          <Plus /> Add record
        </Button>
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
          ) : rows.length === 0 ? (
            <div className="m-4 flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <CalendarX className="text-muted-foreground" />
              <p className="font-medium">No attendance records</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-215 text-sm">
                <thead>
                  <tr className="border-b bg-indigo-600 text-left text-xs text-white">
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">Staff</th>
                    <th className="p-3 font-medium">Check in</th>
                    <th className="p-3 font-medium">Check out</th>
                    <th className="p-3 font-medium">Break</th>
                    <th className="p-3 font-medium">Total</th>
                    <th className="p-3 font-medium" />
                    <th className="p-3 font-medium text-right">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 whitespace-nowrap font-medium">{formatDay(r.date)}</td>
                      <td className="p-3 whitespace-nowrap">{userName(r.user)}</td>
                      <td className="p-3 whitespace-nowrap">{formatTime(r.checkIn)}</td>
                      <td className="p-3 whitespace-nowrap">{formatTime(r.checkOut)}</td>
                      <td className="p-3 whitespace-nowrap">{formatDuration(r.breakMinutes)}</td>
                      <td className="p-3 whitespace-nowrap font-medium">{formatDuration(r.totalWorkMinutes)}</td>
                      <td className="p-3">
                        <AttendanceFlags record={r} />
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="icon" aria-label="Edit record" onClick={() => openEdit(r)}>
                          <Pencil />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPage}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPage}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
