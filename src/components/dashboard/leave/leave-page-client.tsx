"use client";

import {
  BarChart3,
  CalendarDays,
  CalendarHeart,
  ClipboardCheck,
  ScrollText,
  Settings2,
  type LucideIcon,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN_ROLES, APPROVER_ROLES } from "@/features/leave/constants/leave.constant";
import { useLeaveDashboardSummary } from "@/features/leave/hooks/use-leave";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";

import { ApprovalsTab } from "./approvals-tab";
import { MyLeaveTab } from "./my-leave-tab";
import { TeamCalendarTab } from "./team-calendar-tab";
import { ReportsTab } from "./reports-tab";
import { PolicyTab } from "./policy-tab";
import { AuditLogTab } from "./audit-log-tab";

function Tab({
  value,
  icon: Icon,
  label,
  count,
}: {
  value: string;
  icon: LucideIcon;
  label: string;
  count?: number;
}) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "h-10 min-h-10 min-w-fit gap-2 rounded-lg px-4 py-0 text-sm",
        "data-active:bg-indigo-600 data-active:text-white data-active:shadow-md",
        "dark:data-active:bg-indigo-600 dark:data-active:text-white",
      )}
    >
      <Icon aria-hidden="true" />
      <span>{label}</span>
      {count ? (
        <span className="rounded-full bg-amber-500 px-1.5 text-[11px] font-semibold leading-5 text-white">
          {count}
        </span>
      ) : null}
    </TabsTrigger>
  );
}

export function LeavePageClient() {
  const role = useAuthStore((s) => s.user?.role) as string | undefined;
  const isApprover = Boolean(role && APPROVER_ROLES.includes(role));
  // Admins and super admins do not request leave, so they only get the management tabs.
  const isAdmin = Boolean(role && ADMIN_ROLES.includes(role));

  // Shares its cache entry with the dashboard widget, so this costs no extra request there.
  const summary = useLeaveDashboardSummary();
  const pending = isApprover ? (summary.data?.data.team?.pendingApprovals ?? 0) : 0;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
          <CalendarHeart className="size-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Review requests, manage balances and set the leave policy."
              : "Request time off, track your balance and see who is away."}
          </p>
        </div>
      </div>

      {/* key forces the default tab to be recomputed once the user has loaded */}
      <Tabs
        key={isAdmin ? "admin" : "member"}
        defaultValue={isAdmin ? "approvals" : "my-leave"}
        className="w-full gap-5"
      >
        {/* Full-width bar; scrolls sideways on small screens instead of wrapping */}
        <div className="w-full overflow-x-auto rounded-xl border bg-card p-1 shadow-sm">
          <TabsList className="flex h-auto w-full min-w-max justify-start gap-1 bg-transparent p-0 group-data-horizontal/tabs:h-auto sm:justify-stretch">
            {!isAdmin && <Tab value="my-leave" icon={CalendarDays} label="My Leave" />}
            <Tab value="calendar" icon={CalendarHeart} label="Team Calendar" />
            {isApprover && <Tab value="approvals" icon={ClipboardCheck} label="Approvals" count={pending} />}
            {isApprover && <Tab value="reports" icon={BarChart3} label="Reports" />}
            {isAdmin && <Tab value="policy" icon={Settings2} label="Policy" />}
            {isAdmin && <Tab value="audit" icon={ScrollText} label="Audit Log" />}
          </TabsList>
        </div>

        {!isAdmin && (
          <TabsContent value="my-leave">
            <MyLeaveTab />
          </TabsContent>
        )}
        <TabsContent value="calendar">
          <TeamCalendarTab />
        </TabsContent>
        {isApprover && (
          <TabsContent value="approvals">
            <ApprovalsTab />
          </TabsContent>
        )}
        {isApprover && (
          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>
        )}
        {isAdmin && (
          <TabsContent value="policy">
            <PolicyTab />
          </TabsContent>
        )}
        {isAdmin && (
          <TabsContent value="audit">
            <AuditLogTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default LeavePageClient;
