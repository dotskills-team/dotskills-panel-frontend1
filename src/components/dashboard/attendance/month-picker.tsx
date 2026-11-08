"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface MonthPickerProps {
  /** "YYYY-MM" */
  value: string;
  onChange: (value: string) => void;
}

/** Month + year selects that produce a "YYYY-MM" value. */
export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [year, month] = value.split("-").map(Number);
  const thisYear = Number(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }).slice(0, 4));
  const years = Array.from({ length: 5 }, (_, i) => thisYear - i);

  const emit = (y: number, m: number) => onChange(`${y}-${String(m).padStart(2, "0")}`);

  return (
    <div className="flex items-center gap-2">
      <Select value={String(month)} onValueChange={(v) => emit(year, Number(v))}>
        <SelectTrigger className="w-36" aria-label="Month">
          <SelectValue>{MONTHS[month - 1]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((name, i) => (
            <SelectItem key={name} value={String(i + 1)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={String(year)} onValueChange={(v) => emit(Number(v), month)}>
        <SelectTrigger className="w-24" aria-label="Year">
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
    </div>
  );
}
