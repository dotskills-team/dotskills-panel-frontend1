"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search } from "lucide-react";
import {
  USER_ROLES,
  USER_DEPARTMENTS,
  USER_DESIGNATIONS,
  USER_STATUSES,
} from "@/features/users/constants/user.constant";

interface UserFiltersState {
  search?: string;
  role?: string;
  status?: string;
  department?: string;
  designation?: string;
}

interface UserFiltersProps {
  filters: UserFiltersState;
  onSearch: (search: string) => void;
  onRoleChange: (role?: string) => void;
  onStatusChange: (status?: string) => void;
  onDepartmentChange: (department?: string) => void;
  onDesignationChange: (designation?: string) => void;
  onClear: () => void;
}

export function UserFilters({
  filters,
  onSearch,
  onRoleChange,
  onStatusChange,
  onDepartmentChange,
  onDesignationChange,
  onClear,
}: UserFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.role ||
    filters.status ||
    filters.department ||
    filters.designation;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, email, phone..."
            value={filters.search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select value={filters.role || ""} onValueChange={(value) => onRoleChange(value || undefined)}>
          <SelectTrigger>
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

        <Select value={filters.status || ""} onValueChange={(value) => onStatusChange(value || undefined)}>
          <SelectTrigger>
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
          <SelectTrigger>
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
          <SelectTrigger>
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
      </div>
    </div>
  );
}
