"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  read: boolean;
  type?: "info" | "warning" | "error" | "success";
}

export function HeaderNotifications() {
  // Mock notifications - replace with real data
  const notifications: Notification[] = [
    {
      id: "1",
      title: "New order received",
      description: "Order #1234 from John Doe",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "System update completed",
      description: "Dashboard updated to latest version",
      timestamp: new Date(Date.now() - 1 * 3600000),
      read: true,
      type: "success",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg hover:bg-accent/50"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} new</Badge>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col gap-1 px-4 py-3 cursor-pointer rounded-none border-b last:border-b-0 ${
                  !notification.read ? "bg-accent/5" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {notification.title}
                  </span>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </div>
                {notification.description && (
                  <p className="text-xs text-muted-foreground">
                    {notification.description}
                  </p>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatTime(notification.timestamp)}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
