/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, BookOpen, ShoppingCart, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  type: "user_registered" | "course_published" | "order_received" | "subscription_renewed";
  title: string;
  description: string;
  timestamp: string;
  avatar?: string;
  userName?: string;
}

interface RecentActivitiesProps {
  activities?: Activity[];
  isLoading?: boolean;
}

const activityIcons: Record<string, any> = {
  user_registered: UserPlus,
  course_published: BookOpen,
  order_received: ShoppingCart,
  subscription_renewed: RefreshCw,
};

const activityColors: Record<string, string> = {
  user_registered: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200",
  course_published: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200",
  order_received: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200",
  subscription_renewed: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200",
};

export function RecentActivities({ activities = [], isLoading = false }: RecentActivitiesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </div>
          <Button variant="ghost" size="sm" disabled>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const defaultActivities: Activity[] = [
    {
      id: "1",
      type: "user_registered",
      title: "New user registered",
      description: "Jane Cooper joined the platform",
      timestamp: "2m ago",
      userName: "Jane Cooper",
    },
    {
      id: "2",
      type: "course_published",
      title: "New course published",
      description: "React Advanced Course is now live",
      timestamp: "15m ago",
    },
    {
      id: "3",
      type: "order_received",
      title: "New order received",
      description: "Order #ORD-1234 has been placed",
      timestamp: "1h ago",
    },
    {
      id: "4",
      type: "subscription_renewed",
      title: "Subscription renewed",
      description: "Pro Plan renewed by Floyd Miles",
      timestamp: "3h ago",
    },
  ];

  const displayActivities = activities.length > 0 ? activities.slice(0, 4) : defaultActivities;

  return (
    <Card className="bg-gray-100 dark:bg-slate-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest platform activities</CardDescription>
        </div>
        <Button variant="ghost" size="sm">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => {
            const IconComponent = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div key={activity.id} className="flex gap-4">
                <div className={`p-2 rounded-lg ${colorClass} h-fit`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
