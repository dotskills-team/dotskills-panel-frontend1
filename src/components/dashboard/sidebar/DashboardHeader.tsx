"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { HeaderBreadcrumbs } from "../header/HeaderBreadcrumbs";
import { HeaderNotifications } from "./HeaderNotifications";
import { HeaderSearch } from "./HeaderSearch";
import { UserMenu } from "./UserMenu";
import ThemeToggle from "../header/ThemeToggle";
import { CalculatorModal } from "@/components/calculator/calculator-modal";
import HeaderFollowUpCalendar from "../header/HeaderFollowUpCalendar";

export function DashboardHeader() {
  return (
    <header
      className="bg-gray-100 dark:bg-slate-950 sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60"
      role="banner"
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <SidebarTrigger className="-ml-1 h-9 w-9 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary" />
          <Separator orientation="vertical" className="h-5" />
          <div className="hidden min-w-0 flex-1 md:block">
            <HeaderBreadcrumbs />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
                     <CalculatorModal />

          <HeaderSearch />
          <HeaderFollowUpCalendar />
          <HeaderNotifications />
          <ThemeToggle />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
