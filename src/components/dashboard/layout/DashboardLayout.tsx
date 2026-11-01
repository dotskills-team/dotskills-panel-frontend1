"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PremiumSidebar } from "../sidebar/PremiumSidebar";
import DashboardSkeleton from "../DashboardSkeleton";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { DashboardHeader } from "../sidebar/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <SidebarProvider>
      <PremiumSidebar />
      {/* min-w-0: without it this flex child grows to the widest content (e.g. a
          wide table) and the whole page gets a horizontal scrollbar. Wide content
          must scroll inside its own container instead. */}
      <SidebarInset className="min-w-0">
        {/* Sticky Header */}
        <DashboardHeader />

        {/* Main Content Area: the window is the only vertical scroller (no nested
            overflow container, which produced a second scrollbar) */}
        <div className="bg-gray-100 dark:bg-slate-950 min-w-0 flex-1">
          <div className="flex min-w-0 flex-col gap-4 p-3 sm:p-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
