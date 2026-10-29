"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { User } from "@/types";

interface RecentUsersTableProps {
  users?: User[];
  isLoading?: boolean;
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  MANAGER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  DEVELOPER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  DESIGNER: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  MARKETER: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  STAFF: "bg-muted text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  INACTIVE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function RecentUsersTable({ users = [], isLoading = false }: RecentUsersTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </div>
          <Button variant="ghost" size="sm" disabled>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayUsers = users.slice(0, 4);

  return (
    <Card className="bg-gray-100 dark:bg-slate-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest registered users</CardDescription>
        </div>
        <Link href="/dashboard/admin/users">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayUsers.length > 0 ? (
            displayUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                  <AvatarFallback>
                    {user.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={roleColors[user.role] || roleColors.STAFF}>
                    {user.role}
                  </Badge>
                  <Badge className={statusColors[user.status] || statusColors.ACTIVE}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No users yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
