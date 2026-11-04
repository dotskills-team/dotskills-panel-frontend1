"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLeaveCalendar } from "@/features/leave/hooks/use-leave";
import { LEAVE_TYPE_LABEL } from "@/features/leave/constants/leave.constant";
import type { ILeaveCalendarEntry } from "@/types/leave.types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MS = 24 * 60 * 60 * 1000;

const toKey = (d: Date) => d.toISOString().slice(0, 10);
const dayOf = (iso: string) => iso.slice(0, 10);

/** Builds the 6-week grid (as UTC dates) that contains the given month. */
function buildGrid(year: number, month: number) {
  const first = new Date(Date.UTC(year, month, 1));
  const start = new Date(first.getTime() - first.getUTCDay() * DAY_MS);
  return Array.from({ length: 42 }, (_, i) => new Date(start.getTime() + i * DAY_MS));
}

function chipStyle(e: ILeaveCalendarEntry) {
  if (e.isExtra) return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
  if (e.status === "pending") return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200";
  return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200";
}

function entryLabel(e: ILeaveCalendarEntry) {
  const half = e.halfDaySession ? ` (${e.halfDaySession})` : "";
  return `${e.staff.name}${half}`;
}

export function TeamCalendarTab() {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState<string | null>(toKey(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))));

  const grid = useMemo(() => buildGrid(cursor.year, cursor.month), [cursor]);
  const from = toKey(grid[0]);
  const to = toKey(grid[grid.length - 1]);
  const { data, isLoading, isError, error } = useLeaveCalendar(from, to);
  const calendar = data?.data;

  const holidays = useMemo(
    () => new Map((calendar?.publicHolidays ?? []).map((h) => [h.date, h.name])),
    [calendar],
  );

  // Index entries by day once instead of filtering for every cell.
  const byDay = useMemo(() => {
    const map = new Map<string, ILeaveCalendarEntry[]>();
    for (const e of calendar?.entries ?? []) {
      const start = new Date(dayOf(e.startDate)).getTime();
      const end = new Date(dayOf(e.endDate)).getTime();
      for (let t = start; t <= end; t += DAY_MS) {
        const key = toKey(new Date(t));
        map.set(key, [...(map.get(key) ?? []), e]);
      }
    }
    return map;
  }, [calendar]);

  const title = new Date(Date.UTC(cursor.year, cursor.month, 1)).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const shift = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(Date.UTC(year, month + delta, 1));
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
    });

  const isOff = (d: Date) => (calendar?.weeklyOffDays ?? []).includes(d.getUTCDay());
  const selectedEntries = selected ? (byDay.get(selected) ?? []) : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" aria-label="Previous month" onClick={() => shift(-1)}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" aria-label="Next month" onClick={() => shift(1)}>
            <ChevronRight />
          </Button>
          <h2 className="ml-2 text-lg font-semibold">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-indigo-400" /> Leave
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-red-400" /> Extra leave
          </span>
          {calendar?.entries.some((e) => e.status === "pending") && (
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-amber-400" /> Pending
            </span>
          )}
        </div>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Unable to load the calendar."}
        </div>
      ) : isLoading ? (
        <Skeleton className="h-130 w-full rounded-xl" />
      ) : (
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-2">
                  {w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {grid.map((d) => {
                const key = toKey(d);
                const inMonth = d.getUTCMonth() === cursor.month;
                const entries = byDay.get(key) ?? [];
                const holiday = holidays.get(key);
                const off = isOff(d) || Boolean(holiday);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelected(key)}
                    className={cn(
                      "flex min-h-20 flex-col items-stretch gap-1 border-b border-r p-1.5 text-left align-top transition-colors last:border-r-0 hover:bg-muted/40 sm:min-h-28",
                      !inMonth && "bg-muted/20 text-muted-foreground/60",
                      off && inMonth && "bg-slate-50 dark:bg-slate-900/40",
                      selected === key && "ring-2 ring-inset ring-indigo-500",
                    )}
                    aria-label={`${key}, ${entries.length} on leave${holiday ? `, ${holiday}` : ""}`}
                  >
                    <span className="text-xs font-medium">{d.getUTCDate()}</span>
                    {holiday && <span className="truncate text-[10px] text-emerald-700">{holiday}</span>}
                    {entries.slice(0, 2).map((e) => (
                      <span
                        key={e._id}
                        className={cn("truncate rounded px-1 py-0.5 text-[10px] sm:text-[11px]", chipStyle(e))}
                      >
                        {entryLabel(e)}
                      </span>
                    ))}
                    {entries.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{entries.length - 2} more</span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {selected && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">
              {new Date(`${selected}T00:00:00Z`).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                timeZone: "UTC",
              })}
            </h3>
            {holidays.get(selected) && (
              <p className="text-sm text-emerald-700">Public holiday: {holidays.get(selected)}</p>
            )}
            {selectedEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No one is on leave.</p>
            ) : (
              <ul className="divide-y">
                {selectedEntries.map((e) => (
                  <li key={e._id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                    <span className="font-medium">
                      {entryLabel(e)}
                      {e.staff.department && (
                        <span className="font-normal text-muted-foreground"> · {e.staff.department}</span>
                      )}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      {e.leaveType && <span>{LEAVE_TYPE_LABEL[e.leaveType]}</span>}
                      {e.status === "pending" && <span className="text-amber-700">Pending</span>}
                      {e.isExtra && <span className="font-medium text-red-600">Extra leave</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
