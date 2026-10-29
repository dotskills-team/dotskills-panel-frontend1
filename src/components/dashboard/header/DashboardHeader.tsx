"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { HeaderBreadcrumbs } from "./HeaderBreadcrumbs";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderNotifications } from "./HeaderNotifications";
import { UserMenu } from "./UserMenu";
import ThemeToggle from "./ThemeToggle";

export function DashboardHeader() {
  return (
    <header
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40"
      role="banner"
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4">
        {/* Left side - Sidebar trigger and breadcrumbs */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SidebarTrigger className="-ml-1 h-9 w-9" />
          <Separator orientation="vertical" className="h-6" />
          <div className="hidden md:block flex-1 min-w-0">
            <HeaderBreadcrumbs />
          </div>
        </div>

        {/* Right side - Search, notifications, theme, user menu */}
        <div className="flex items-center gap-2">
          <HeaderSearch />
          <HeaderNotifications />
          <ThemeToggle />
          <Separator orientation="vertical" className="h-6" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
