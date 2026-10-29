"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import { getLeadFullName } from "@/features/leads/utils/lead.utils";
import type { LeadFilters } from "@/types/lead";

interface LeadsMoreFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: LeadFilters;
  onApply: (patch: Partial<LeadFilters>) => void;
}

const ALL = "__all__";

export function LeadsMoreFiltersSheet({
  open,
  onOpenChange,
  filters,
  onApply,
}: LeadsMoreFiltersSheetProps) {
  const { data } = useAssignableUsers();
  const users = data?.data ?? [];

  const [assignedTo, setAssignedTo] = useState(filters.assignedTo ?? ALL);
  const [isConverted, setIsConverted] = useState<string>(
    filters.isConverted === undefined ? ALL : String(filters.isConverted),
  );
  const [gte, setGte] = useState(filters["createdAt[gte]"] ?? "");
  const [lte, setLte] = useState(filters["createdAt[lte]"] ?? "");

  const handleApply = () => {
    onApply({
      assignedTo: assignedTo === ALL ? undefined : assignedTo,
      isConverted: isConverted === ALL ? undefined : isConverted === "true",
      "createdAt[gte]": gte || undefined,
      "createdAt[lte]": lte || undefined,
    });
    onOpenChange(false);
  };

  const handleClear = () => {
    setAssignedTo(ALL);
    setIsConverted(ALL);
    setGte("");
    setLte("");
    onApply({
      assignedTo: undefined,
      isConverted: undefined,
      "createdAt[gte]": undefined,
      "createdAt[lte]": undefined,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6">
        <SheetHeader>
          <SheetTitle>More Filters</SheetTitle>
          <SheetDescription>
            Narrow down leads by assignment, conversion, and date range.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4">
          <div className="flex flex-col gap-2">
            <Label>Assigned To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Any team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Any team member</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {getLeadFullName(user)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Conversion Status</Label>
            <Select value={isConverted} onValueChange={setIsConverted}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Any</SelectItem>
                <SelectItem value="true">Converted</SelectItem>
                <SelectItem value="false">Not Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Created From</Label>
            <Input
              type="date"
              value={gte}
              onChange={(event) => setGte(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Created To</Label>
            <Input
              type="date"
              value={lte}
              onChange={(event) => setLte(event.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="mt-auto flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={handleClear}>
            Clear All
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
