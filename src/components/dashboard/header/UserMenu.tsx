"use client";

import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { formatRole } from "@/lib/dashboard-utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserMenu() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return (
      <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
    );
  }

  const userName = user.fullName || user.email || "User";
  const userRole = formatRole(user.role || "STAFF");
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0"
          title={`${userName} - ${userRole}`}
        >
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold text-foreground truncate">
            {userName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {userRole}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 cursor-pointer">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
