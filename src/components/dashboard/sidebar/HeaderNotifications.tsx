"use client";

import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: "1",
    title: "New lead assigned",
    description: "Sarah Johnson assigned you a new lead: James Smith.",
    time: "5m ago",
    unread: true,
  },
  {
    id: "2",
    title: "Lead converted",
    description: "Alex Davis was converted to a client.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    title: "Task due today",
    description: "Follow-up call with Rachel Wilson is due today.",
    time: "3h ago",
    unread: false,
  },
];

export function HeaderNotifications() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm">Notifications</DropdownMenuLabel>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
            <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Mark all read
          </Button>
        </div>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex items-start gap-2.5 whitespace-normal py-2.5"
            >
              <span
                className={cn(
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  notification.unread ? "bg-primary" : "bg-transparent",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{notification.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {notification.description}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/70">{notification.time}</p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
