"use client";

import { Download, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLIENT_STATUS_OPTIONS } from "@/features/clients/constants/client.constant";
import { cn } from "@/lib/utils";

const ALL = "__all__";

interface ClientsTrashToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExport: () => void;
  exportDisabled: boolean;
}

export function ClientsTrashToolbar({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  onRefresh,
  isRefreshing,
  onExport,
  exportDisabled,
}: ClientsTrashToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            placeholder="Search by name, company, email or phone..."
            className="pl-9"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <Select value={status || ALL} onValueChange={(value) => onStatusChange(value === ALL ? "" : value)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Statuses</SelectItem>
            {CLIENT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
        <Button variant="outline" onClick={onExport} disabled={exportDisabled}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
