"use client";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useAuthStore } from "@/stores";
import { WelcomeBanner } from "./WelcomeBanner";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { ActivityFeed, type ActivityItem } from "./ActivityFeed";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Plus,
  Eye,
  Download,
  TrendingUp,
  Zap,
  MessageSquare,
} from "lucide-react";

/**
 * Premium Dashboard Overview Component
 * Displays welcome banner, stats, quick actions, and activity feed
 * Automatically adapts to user role and permissions
 */
export function DashboardOverview() {
  const { data: user, isLoading } = useCurrentUser();
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Mock stats - replace with real data from API
  const stats = [
    {
      title: "Total Revenue",
      value: "12,543",
      icon: <TrendingUp className="h-6 w-6" />,
      trend: { value: 12.5, direction: "up" as const },
      variant: "success" as const,
      description: "This month",
    },
    {
      title: "Active Users",
      value: "2,847",
      icon: <Users className="h-6 w-6" />,
      trend: { value: 5.2, direction: "up" as const },
      variant: "info" as const,
      description: "Online now",
    },
    {
      title: "Pending Tasks",
      value: "23",
      icon: <FileText className="h-6 w-6" />,
      trend: { value: 3.1, direction: "down" as const },
      variant: "warning" as const,
      description: "Needs attention",
    },
    {
      title: "Team Performance",
      value: "94%",
      icon: <BarChart3 className="h-6 w-6" />,
      trend: { value: 8.3, direction: "up" as const },
      variant: "default" as const,
      description: "Target achieved",
    },
  ];

  // Mock quick actions - customize based on user role
  const quickActions = [
    {
      id: "create-project",
      label: "Create Project",
      description: "Start a new project",
      icon: <Plus className="h-5 w-5" />,
      onClick: () => console.log("Create project"),
    },
    {
      id: "view-reports",
      label: "View Reports",
      description: "Check analytics",
      icon: <Eye className="h-5 w-5" />,
      onClick: () => console.log("View reports"),
    },
    {
      id: "export-data",
      label: "Export Data",
      description: "Download files",
      icon: <Download className="h-5 w-5" />,
      onClick: () => console.log("Export data"),
    },
  ];

  // Mock activities - replace with real data from API
  const activities: ActivityItem[] = [
    {
      id: "1",
      icon: <Zap className="h-4 w-4" />,
      title: "System upgrade completed",
      description: "All services are operational",
      timestamp: new Date(Date.now() - 15 * 60000),
      type: "success",
    },
    {
      id: "2",
      icon: <Users className="h-4 w-4" />,
      title: "New team member invited",
      description: "Sarah Johnson joined the workspace",
      timestamp: new Date(Date.now() - 45 * 60000),
      type: "info",
    },
    {
      id: "3",
      icon: <FileText className="h-4 w-4" />,
      title: "Report generated",
      description: "Monthly performance report ready",
      timestamp: new Date(Date.now() - 2 * 3600000),
      type: "default",
      actionLabel: "Download",
    },
    {
      id: "4",
      icon: <MessageSquare className="h-4 w-4" />,
      title: "New feedback received",
      description: "Customer review pending approval",
      timestamp: new Date(Date.now() - 3 * 3600000),
      type: "warning",
    },
  ];

  if (!isInitialized || isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-24 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const userName = user?.fullName || user?.email || "User";
  const userGreeting = `Welcome back, ${userName}! 👋`;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <WelcomeBanner
        title={userGreeting}
        subtitle="Here's what's happening with your workspace"
        description="You have 3 pending notifications and 23 tasks that need your attention."
        icon={<Zap className="h-6 w-6" />}
        actionLabel="View Details"
        onAction={() => console.log("View details")}
        variant="info"
      />

      {/* Stats Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <StatsCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              description={stat.description}
              variant={stat.variant}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions
        title="Quick Actions"
        description="Frequently used actions and shortcuts"
        actions={quickActions}
        columns={3}
      />

      {/* Activity Feed */}
      <ActivityFeed
        title="Recent Activity"
        items={activities}
        maxItems={5}
        emptyState={{
          icon: <MessageSquare className="h-12 w-12" />,
          title: "No recent activity",
          description: "Your activity will appear here",
        }}
      />
    </div>
  );
}
