
"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

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
  USER_ROLES,
  USER_DEPARTMENTS,
  USER_DESIGNATIONS,
  USER_STATUSES,
} from "@/features/users/constants/user.constant";

interface UserFiltersState {
  searchTerm?: string;
  role?: string;
  status?: string;
  department?: string;
  designation?: string;
  startDate?: string;
  endDate?: string;
}

interface UsersToolbarProps {
  filters: UserFiltersState;
  onSearch: (search: string) => void;
  onRoleChange: (role?: string) => void;
  onStatusChange: (status?: string) => void;
  onDepartmentChange: (department?: string) => void;
  onDesignationChange: (designation?: string) => void;
  onDateChange?: (startDate?: string, endDate?: string) => void;
  onClear: () => void;
  onAddUser?: () => void;
}

export function UsersToolbar({
  filters,
  onSearch,
  onRoleChange,
  onStatusChange,
  onDepartmentChange,
  onDesignationChange,
  onClear,
}: UsersToolbarProps) {
  const [search, setSearch] = useState(filters.searchTerm ?? "");

  const hasActiveFilters =
    filters.searchTerm ||
    filters.role ||
    filters.status ||
    filters.department ||
    filters.designation ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            placeholder="Search by name, email, phone..."
            className="pl-9"
            onChange={(event) => {
              setSearch(event.target.value);
              onSearch(event.target.value);
            }}
          />
        </div>

        <Select
          value={filters.role || ""}
          onValueChange={(value) => onRoleChange(value || undefined)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            {USER_ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || ""}
          onValueChange={(value) => onStatusChange(value || undefined)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {USER_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.department || ""}
          onValueChange={(value) => onDepartmentChange(value || undefined)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Departments</SelectItem>
            {USER_DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.designation || ""}
          onValueChange={(value) => onDesignationChange(value || undefined)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Designations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Designations</SelectItem>
            {USER_DESIGNATIONS.map((desig) => (
              <SelectItem key={desig} value={desig}>
                {desig}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClear} className="gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}