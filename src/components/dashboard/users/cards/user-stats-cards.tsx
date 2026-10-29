"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, AlertCircle, Lock } from "lucide-react";

export interface UserStatsData {
  totalCount: number;
  ACTIVE: number;
  INACTIVE: number;
  SUSPENDED: number;
}

interface UserStatsCardsProps {
  stats?: UserStatsData;
  isLoading?: boolean;
}

export function UserStatsCards({ stats, isLoading }: UserStatsCardsProps) {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalCount || 0,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Users",
      value: stats?.ACTIVE || 0,
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      title: "Inactive Users",
      value: stats?.INACTIVE || 0,
      icon: AlertCircle,
      color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Suspended Users",
      value: stats?.SUSPENDED || 0,
      icon: Lock,
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="bg-gray-100 dark:bg-slate-950 hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}