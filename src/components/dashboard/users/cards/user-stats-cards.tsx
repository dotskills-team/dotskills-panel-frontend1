"use client";

import { FinanceStatCard } from "@/components/dashboard/my-finance/FinanceStatCard";
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
      tone: "text-blue-100",
      gradient: "from-blue-600 via-indigo-600 to-violet-600",
      caption: "All registered users",
    },
    {
      title: "Active Users",
      value: stats?.ACTIVE || 0,
      icon: CheckCircle2,
      tone: "text-emerald-100",
      gradient: "from-emerald-500 via-teal-600 to-cyan-700",
      caption: "Currently active",
    },
    {
      title: "Inactive Users",
      value: stats?.INACTIVE || 0,
      icon: AlertCircle,
      tone: "text-amber-100",
      gradient: "from-amber-500 via-orange-500 to-orange-600",
      caption: "Not active",
    },
    {
      title: "Suspended Users",
      value: stats?.SUSPENDED || 0,
      icon: Lock,
      tone: "text-rose-100",
      gradient: "from-rose-500 via-pink-600 to-fuchsia-600",
      caption: "Access suspended",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
      {statCards.map((stat) => (
        <FinanceStatCard
          key={stat.title}
          title={stat.title}
          value={String(stat.value)}
          caption={stat.caption}
          icon={stat.icon}
          tone={stat.tone}
          gradient={stat.gradient}
          loading={isLoading}
        />
      ))}
    </div>
  );
}
