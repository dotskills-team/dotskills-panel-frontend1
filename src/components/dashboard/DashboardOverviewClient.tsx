"use client";

import { useMemo, useState, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboardOverview";
import { useCurrentUser } from "@/stores/auth.selectors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BreakdownCard,
  EmptyState,
  KpiGrid,
  ListCard,
  OverviewSkeleton,
  SectionTitle,
  TrendCard,
} from "@/components/dashboard/overview/overview-widgets";
import {
  DateRangeFilter,
  presetRange,
  type RangePreset,
} from "@/components/dashboard/overview/DateRangeFilter";
import type { DashboardOverview, DashboardRangeParams } from "@/types/dashboard.types";

/** Roles whose dashboard figures can be filtered by date. */
const FILTERABLE_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

/**
 * Grid for a row of cards. One card spans the full width, two split 50/50 on
 * desktop, and three or four share one row on desktop.
 */
const gridCols = (count: number) => {
  if (count <= 1) return "grid gap-4";
  if (count === 2) return "grid gap-4 lg:grid-cols-2";
  if (count === 3) return "grid gap-4 lg:grid-cols-3";
  return "grid gap-4 md:grid-cols-2 xl:grid-cols-4";
};

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  DEVELOPER: "Developer",
  DESIGNER: "Designer",
  MARKETER: "Marketer",
  STAFF: "Staff",
};

const ROLE_SUBTITLE: Record<string, string> = {
  SUPER_ADMIN: "Company-wide money, projects, leads and team at a glance.",
  ADMIN: "Company-wide money, projects, leads and team at a glance.",
  MANAGER: "Your managed projects, collections, dues and upcoming deadlines.",
  DEVELOPER: "Your assigned projects, deadlines and salary.",
  DESIGNER: "Your assigned projects, deadlines and salary.",
  MARKETER: "Your lead pipeline, clients and personal finances.",
  STAFF: "Your lead pipeline, clients and personal finances.",
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export function DashboardOverviewClient() {
  const currentUser = useCurrentUser();
  const canFilter = FILTERABLE_ROLES.includes(currentUser?.role ?? "");

  const [preset, setPreset] = useState<RangePreset>("last6");
  const [custom, setCustom] = useState<DashboardRangeParams>({});

  // Only admins and managers send a date range; other roles keep their fixed windows.
  const range = useMemo<DashboardRangeParams>(() => {
    if (!canFilter) return {};
    if (preset !== "custom") return presetRange(preset);
    return custom.startDate && custom.endDate ? custom : presetRange("last6");
  }, [canFilter, preset, custom]);

  const { data, isLoading, isError, refetch, isFetching } = useDashboardOverview(range);

  if (isLoading) return <OverviewSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border p-10 text-center">
        <p className="font-medium">We couldn&apos;t load your dashboard.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <OverviewContent
      data={data}
      onRefresh={() => refetch()}
      refreshing={isFetching}
      filter={
        canFilter ? (
          <DateRangeFilter
            preset={preset}
            onPresetChange={setPreset}
            custom={custom}
            onCustomChange={setCustom}
          />
        ) : null
      }
    />
  );
}

function OverviewContent({
  data,
  onRefresh,
  refreshing,
  filter,
}: {
  data: DashboardOverview;
  onRefresh: () => void;
  refreshing: boolean;
  filter: ReactNode;
}) {
  const lists = data.lists;

  // Project status is paired with the trend when a trend exists; the rest of the breakdowns follow.
  const statusChart = data.trend ? data.breakdowns.find((b) => b.key === "projectStatus") : undefined;
  const rest = statusChart ? data.breakdowns.filter((b) => b.key !== "projectStatus") : data.breakdowns;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting()}, {data.name}
            </h1>
            <Badge variant="secondary">{ROLE_LABEL[data.role] ?? data.role}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{ROLE_SUBTITLE[data.role] ?? "Your overview."}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Updated {new Date(data.generatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
            <RefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Date filter (admins and managers) */}
      {filter}

      {/* KPIs */}
      <section className="space-y-3">
        <SectionTitle>Key figures</SectionTitle>
        <KpiGrid kpis={data.kpis} />
      </section>

      {/* Money in vs out sits beside projects by status on desktop (admin).
          Without a trend (manager) the status chart joins the breakdown row. */}
      {data.trend && (
        <section className={statusChart ? "grid gap-4 lg:grid-cols-2" : "grid gap-4"}>
          <TrendCard trend={data.trend} />
          {statusChart && <BreakdownCard breakdown={statusChart} />}
        </section>
      )}

      {/* Remaining breakdown charts, one row on desktop */}
      {rest.length > 0 && (
        <section className="space-y-3">
          <SectionTitle>Breakdown</SectionTitle>
          <div className={gridCols(rest.length)}>
            {rest.map((breakdown) => (
              <BreakdownCard key={breakdown.key} breakdown={breakdown} />
            ))}
          </div>
        </section>
      )}

      {/* Lists */}
      {lists.length > 0 && (
        <section className="space-y-3">
          <SectionTitle>Latest activity</SectionTitle>
          <div className={gridCols(lists.length)}>
            {lists.map((list) => (
              <ListCard key={list.key} list={list} />
            ))}
          </div>
        </section>
      )}

      {data.kpis.length === 0 && <EmptyState text="No dashboard data for your role yet." />}
    </div>
  );
}

export default DashboardOverviewClient;
