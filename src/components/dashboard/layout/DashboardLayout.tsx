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
      <SidebarInset>
        {/* Sticky Header */}
        <DashboardHeader />

        {/* Main Content Area */}
        <main className="bg-gray-100 dark:bg-slate-950 flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <div className="min-h-full">
              <div className="flex flex-col gap-4 p-4">
                {children}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
