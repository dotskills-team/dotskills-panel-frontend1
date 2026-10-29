
"use client";

import { useState } from "react";
import {
  Download,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LEAD_CONTACT_STATUS_OPTIONS,
  LEAD_PRIORITY_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  LEAD_TYPE_OPTIONS,
    NOTE_ACTIVITY_OPTIONS,

} from "@/features/leads/constants/lead.constant";
import type { LeadFilters } from "@/types/lead";
import { LeadsMoreFiltersSheet } from "./leads-more-filters-sheet";
import Link from "next/link";

interface LeadsToolbarProps {
  filters: LeadFilters;
  activeFilterCount: number;
  onSearchChange: (value: string) => void;
  onUpdateFilters: (patch: Partial<LeadFilters>) => void;
  onExport: () => void;
  onImport: () => void;
  onAddLead: () => void;
}

const ALL = "__all__";

export function LeadsToolbar({
  filters,
  // activeFilterCount,
  onSearchChange,
  onUpdateFilters,
  onExport,
  onImport,
  onAddLead,
}: LeadsToolbarProps) {
  const [search, setSearch] = useState(filters.searchTerm ?? "");
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: date filter + import/export/trash/add lead actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="w-full sm:w-36"
            value={filters.startDate ?? ""}
            onChange={(e) =>
              onUpdateFilters({ startDate: e.target.value || undefined })
            }
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            className="w-full sm:w-36"
            value={filters.endDate ?? ""}
            onChange={(e) =>
              onUpdateFilters({ endDate: e.target.value || undefined })
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-2 hover:cursor-pointer hover:scale-105 transition-transform duration-500 transform ease-in-out hover:bg-rose-800 text-white bg-red-600"
            asChild
          >
            <Link href="/dashboard/leads/trash">
              <Trash2 className="h-4 w-4" />
              Trash
            </Link>
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={onAddLead}
            variant={"default"}
            className="gap-2 duration-500 hover:cursor-pointer hover:scale-105 transition-transform transform ease-in-out hover:bg-cyan-800 text-white bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Row 2: search + status/contactStatus/source/priority filters */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            placeholder="Search leads by name, email or phone..."
            className="pl-9"
            onChange={(event) => {
              setSearch(event.target.value);
              onSearchChange(event.target.value);
            }}
          />
        </div>

        <Select
          value={filters.status ?? ALL}
          onValueChange={(value) =>
            onUpdateFilters({
              status:
                value === ALL ? undefined : (value as LeadFilters["status"]),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-35">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Statuses</SelectItem>
            {LEAD_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.leadType ?? ALL}
          onValueChange={(value) =>
            onUpdateFilters({
              leadType:
                value === ALL ? undefined : (value as LeadFilters["leadType"]),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-35">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Types</SelectItem>
            {LEAD_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.contactStatus ?? ALL}
          onValueChange={(value) =>
            onUpdateFilters({
              contactStatus:
                value === ALL
                  ? undefined
                  : (value as LeadFilters["contactStatus"]),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Contact Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL}>All Contact Statuses</SelectItem>

            {LEAD_CONTACT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.source ?? ALL}
          onValueChange={(value) =>
            onUpdateFilters({
              source:
                value === ALL ? undefined : (value as LeadFilters["source"]),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-35">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Sources</SelectItem>
            {LEAD_SOURCE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority ?? ALL}
          onValueChange={(value) =>
            onUpdateFilters({
              priority:
                value === ALL ? undefined : (value as LeadFilters["priority"]),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-35">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Priorities</SelectItem>
            {LEAD_PRIORITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
  value={filters.noteAddedWithin ?? ALL}
  onValueChange={(value) =>
    onUpdateFilters({
      noteAddedWithin:
        value === ALL
          ? undefined
          : (value as LeadFilters["noteAddedWithin"]),
    })
  }
>
  <SelectTrigger className="w-full sm:w-40">
    <SelectValue placeholder="Note Added" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value={ALL}>All (Note Date)</SelectItem>
    {NOTE_ACTIVITY_OPTIONS.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
      </div>



      <LeadsMoreFiltersSheet
        open={moreFiltersOpen}
        onOpenChange={setMoreFiltersOpen}
        filters={filters}
        onApply={onUpdateFilters}
      />
    </div>
  );
}