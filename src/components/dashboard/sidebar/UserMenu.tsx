"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores";

export function UserMenu() {
  const { data: user } = useCurrentUser();
  const router = useRouter();
  const reset = useAuthStore((state) => state.reset);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
  const initials =
    `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } finally {
      reset();
      router.replace("/login");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Avatar className="h-8 w-8 ring-2 ring-primary/15">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start leading-none sm:flex">
            <span className="text-sm font-medium text-foreground">{fullName}</span>
            <span className="text-xs text-muted-foreground">
              {user.designation || user.role}
            </span>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium text-foreground">{fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="gap-2">
            <UserIcon className="h-4 w-4" aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="gap-2">
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
