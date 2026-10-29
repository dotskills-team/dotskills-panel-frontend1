"use client";

import { Loader2, Trash2, UserPlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import { getLeadFullName } from "@/features/leads/utils/lead.utils";

interface LeadsBulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAssign: (userId: string) => void;
  onBulkDelete: () => void;
  isAssigning?: boolean;
  isDeleting?: boolean;
}

export function LeadsBulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkAssign,
  onBulkDelete,
  isAssigning,
  isDeleting,
}: LeadsBulkActionsBarProps) {
  const { data } = useAssignableUsers();
  const users = data?.data ?? [];

  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
        {selectedCount} lead{selectedCount > 1 ? "s" : ""} selected
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select onValueChange={onBulkAssign} disabled={isAssigning}>
          <SelectTrigger className="h-9 w-[190px]">
            {isAssigning ? (
              <span className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Assigning...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <SelectValue placeholder="Bulk assign to" />
              </span>
            )}
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user._id} value={user._id}>
                {getLeadFullName(user)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete Selected
        </Button>
      </div>
    </div>
  );
}
