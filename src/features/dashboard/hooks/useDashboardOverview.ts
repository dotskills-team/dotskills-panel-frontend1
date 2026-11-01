"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { DashboardRangeParams } from "@/types/dashboard.types";
import { getDashboardOverview } from "../api/dashboard.api";

export const dashboardOverviewKeys = {
  all: ["dashboard", "overview"] as const,
  range: (range: DashboardRangeParams) => [...dashboardOverviewKeys.all, range] as const,
};

/** Live dashboard data for the given date range. Refreshes every minute. */
export function useDashboardOverview(range: DashboardRangeParams = {}) {
  return useQuery({
    queryKey: dashboardOverviewKeys.range(range),
    queryFn: () => getDashboardOverview(range),
    refetchInterval: 60_000,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
