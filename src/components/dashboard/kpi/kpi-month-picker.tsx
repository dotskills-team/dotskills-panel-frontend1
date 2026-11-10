"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentMonth, MONTH_NAMES, shiftMonth } from "@/features/kpi/utils/kpi.utils";

interface KpiMonthPickerProps {
  value: string;
  onChange: (month: string) => void;
}

export function KpiMonthPicker({ value, onChange }: KpiMonthPickerProps) {
  const [year, monthNumber] = value.split("-");
  const currentYear = Number(getCurrentMonth().slice(0, 4));
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 3 + i);
  if (!years.includes(Number(year))) years.push(Number(year));
  years.sort((a, b) => a - b);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Previous month"
        onClick={() => onChange(shiftMonth(value, -1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Select value={monthNumber} onValueChange={(m) => onChange(`${year}-${m}`)}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTH_NAMES.map((name, i) => (
            <SelectItem key={name} value={String(i + 1).padStart(2, "0")}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={(y) => onChange(`${y}-${monthNumber}`)}>
        <SelectTrigger className="w-24">
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

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Next month"
        onClick={() => onChange(shiftMonth(value, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={value === getCurrentMonth()}
        onClick={() => onChange(getCurrentMonth())}
      >
        This month
      </Button>
    </div>
  );
}
