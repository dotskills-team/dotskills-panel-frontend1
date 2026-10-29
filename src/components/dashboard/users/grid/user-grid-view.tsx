"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Eye, Mail, MoreHorizontal, Pencil, Phone, Trash2, UserCog, Users } from "lucide-react";
import type { User } from "@/types/user.types";
import { UserAvatar } from "../user-avatar";
import { RoleBadge } from "../role-badge";
import { StatusBadge } from "../status-badge";
import { getRoleStyle } from "@/features/users/utils/user-badges";

interface UserGridViewProps {
  users: User[];
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onStatusChange: (user: User) => void;
  onViewDetails: (user: User) => void;
}

export function UserGridView({
  users,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
}: UserGridViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={`skeleton-${idx}`} className="overflow-hidden border-[var(--border)]">
            <div className="h-20 animate-pulse bg-[var(--muted)]" />
            <CardContent className="mt-2 space-y-3">
              <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-3 w-full animate-pulse rounded bg-[var(--muted)]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] py-16 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
          <Users className="h-5 w-5 text-[var(--muted-fg)]" />
        </div>
        <p className="text-sm font-medium text-[var(--foreground)]">No users found</p>
        <p className="text-sm text-[var(--muted-fg)]">
          Try adjusting your filters or create a new user.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-slate-950 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => {
        const style = getRoleStyle(user.role);
        return (
          <Card
            key={user._id}
            className="bg-gray-100 dark:bg-slate-950 p-0 group cursor-pointer overflow-hidden border-[var(--border)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]"
            onClick={() => onViewDetails(user)}
          >
            <CardHeader
              className="relative pb-10"
              style={{
                background: `linear-gradient(135deg, ${style.hex}26, ${style.hex}08)`,
              }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{
                    color: style.hex,
                    borderColor: `${style.hex}33`,
                    backgroundColor: "var(--card)",
                  }}
                >
                  {style.label}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-[var(--muted-fg)] hover:bg-[var(--card)] hover:text-[var(--foreground)]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewDetails(user)} className="gap-2">
                      <Eye className="h-3.5 w-3.5" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)} className="gap-2">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit user
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onStatusChange(user)} className="gap-2">
                      <UserCog className="h-3.5 w-3.5" />
                      Change status
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="gap-2 text-[var(--signal-rose)] focus:text-[var(--signal-rose)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <UserAvatar
              firstName={user.firstName}
              lastName={user.lastName}
              fullName={user.fullName}
              avatar={user.avatar}
              role={user.role}
              size="lg"
              className="-mt-8 ml-5"
            />

            <CardContent className="space-y-4 py-3">
              <div>
                <h3 className="truncate text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--brand-cobalt)]">
                  {user.fullName}
                </h3>
                <p className="truncate text-xs text-[var(--muted-fg)]">
                  {user.designation || "No designation set"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted-fg)]">
                    Verified
                  </span>
                )}
              </div>

              <div className="space-y-1.5 border-t border-[var(--border)] pt-3 text-sm">
                {user.email && (
                  <div className="flex items-center gap-2 text-[var(--muted-fg)]">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2 text-[var(--muted-fg)]">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center gap-2 text-[var(--muted-fg)]">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span>{user.department}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
