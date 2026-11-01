"use client";

import { CalendarRange } from "lucide-react";

import type { DashboardRangeParams } from "@/types/dashboard.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type RangePreset = "all" | "thisMonth" | "last3" | "last6" | "thisYear" | "custom";

const PRESETS: { value: Exclude<RangePreset, "custom">; label: string }[] = [
  { value: "thisMonth", label: "This month" },
  { value: "last3", label: "Last 3 months" },
  { value: "last6", label: "Last 6 months" },
  { value: "thisYear", label: "This year" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** YYYY-MM-DD in local time, as the date inputs use. */
export const toDateInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Start/end dates for a preset, ending today. */
export const presetRange = (preset: Exclude<RangePreset, "custom">): DashboardRangeParams => {
  if (preset === "all") return {};
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const start =
    preset === "thisMonth"
      ? new Date(y, m, 1)
      : preset === "last3"
        ? new Date(y, m - 2, 1)
        : preset === "last6"
          ? new Date(y, m - 5, 1)
          : new Date(y, 0, 1);
  return { startDate: toDateInput(start), endDate: toDateInput(today) };
};

interface DateRangeFilterProps {
  preset: RangePreset;
  onPresetChange: (preset: RangePreset) => void;
  custom: DashboardRangeParams;
  onCustomChange: (range: DashboardRangeParams) => void;
  /** Adds an "All time" option (no date filter). */
  showAll?: boolean;
}

export function DateRangeFilter({
  preset,
  onPresetChange,
  custom,
  onCustomChange,
  showAll = false,
}: DateRangeFilterProps) {
  const today = toDateInput(new Date());

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 md:flex-row md:flex-wrap md:items-center">
      <span className="flex items-center gap-2 px-1 text-sm font-medium text-muted-foreground">
        <CalendarRange className="size-4" />
        Date range
      </span>

      <div className="flex flex-wrap gap-2">
        {showAll && (
          <Button
            size="sm"
            variant={preset === "all" ? "default" : "outline"}
            className={cn(preset === "all" && "bg-indigo-600 text-white hover:bg-indigo-500")}
            onClick={() => onPresetChange("all")}
          >
            All time
          </Button>
        )}
        {PRESETS.map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant={preset === p.value ? "default" : "outline"}
            className={cn(preset === p.value && "bg-indigo-600 text-white hover:bg-indigo-500")}
            onClick={() => onPresetChange(p.value)}
          >
            {p.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant={preset === "custom" ? "default" : "outline"}
          className={cn(preset === "custom" && "bg-indigo-600 text-white hover:bg-indigo-500")}
          onClick={() => onPresetChange("custom")}
        >
          Custom
        </Button>
      </div>

      {preset === "custom" && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="date"
            aria-label="Start date"
            max={custom.endDate || today}
            value={custom.startDate ?? ""}
            onChange={(e) => onCustomChange({ ...custom, startDate: e.target.value })}
            className="h-9 w-full sm:w-44"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            aria-label="End date"
            min={custom.startDate || undefined}
            max={today}
            value={custom.endDate ?? ""}
            onChange={(e) => onCustomChange({ ...custom, endDate: e.target.value })}
            className="h-9 w-full sm:w-44"
          />
        </div>
      )}
    </div>
  );
}

export default DateRangeFilter;
