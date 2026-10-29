"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { Users, BarChart3, TrendingUp, ShoppingCart } from "lucide-react";
import { StatCardWithChart } from "@/components/dashboard/stat-card-with-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UserRoleChart } from "@/components/dashboard/user-role-chart";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { RecentUsersTable } from "@/components/dashboard/recent-users-table";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { TopCourses } from "@/components/dashboard/top-courses";
import { useUsers } from "@/features/users/hooks/useUsers";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

// Generate mock sparkline data
const generateSparklineData = () =>
  Array.from({ length: 12 }, () => ({
    value: Math.floor(Math.random() * 100),
  }));

export function DashboardOverviewClient() {
  const [dateRange, setDateRange] = useState("May 18 - Jun 18, 2025");
  const { isLoading: statsLoading, users, leads } = useDashboardStats();
  const { data: usersData, isLoading: usersListLoading } = useUsers({ limit: 10, page: 1 });

  // Mock data for demonstration
  const statCards = [
    {
      title: "Total Users",
      value: users.total,
      trend: 12.5,
      icon: Users,
      iconBgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
      chartColor: "#6366f1",
      chartData: generateSparklineData(),
      prefix: "",
      suffix: "",
    },
    {
      title: "Active Users",
      value: users.active,
      trend: 8.3,
      icon: BarChart3,
      iconBgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
      chartColor: "#10b981",
      chartData: generateSparklineData(),
      prefix: "",
      suffix: "",
    },
    {
      title: "Total Revenue",
      value: 48750,
      trend: 15.8,
      icon: TrendingUp,
      iconBgColor: "bg-emerald-100 dark:bg-emerald-900",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      chartColor: "#059669",
      chartData: generateSparklineData(),
      prefix: "৳",
      suffix: "",
    },
    {
      title: "Total Orders",
      value: 3215,
      trend: 10.2,
      icon: ShoppingCart,
      iconBgColor: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-400",
      chartColor: "#f59e0b",
      chartData: generateSparklineData(),
      prefix: "",
      suffix: "",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange}
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCardWithChart
            key={card.title}
            {...card}
            isLoading={statsLoading}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={[]} isLoading={statsLoading} />
        </div>
        <div>
          <UserRoleChart isLoading={statsLoading} />
        </div>
      </div>

      {/* User Growth */}
      <UserGrowthChart isLoading={statsLoading} />

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentUsersTable users={usersData?.data} isLoading={usersListLoading} />
        <RecentActivities isLoading={statsLoading} />
        <TopCourses isLoading={statsLoading} />
      </div>
    </div>
  );
}
