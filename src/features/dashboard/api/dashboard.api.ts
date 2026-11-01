import api from "@/lib/axios";
import type { DashboardOverview, DashboardRangeParams } from "@/types/dashboard.types";

interface DashboardOverviewResponse {
  success?: boolean;
  message?: string;
  data: DashboardOverview;
}

/** Role-based dashboard data for the logged-in user, optionally limited to a date range. */
export async function getDashboardOverview(range: DashboardRangeParams = {}): Promise<DashboardOverview> {
  const response = await api.get<DashboardOverviewResponse>("/dashboard/overview", {
    params: {
      ...(range.startDate ? { startDate: range.startDate } : {}),
      ...(range.endDate ? { endDate: range.endDate } : {}),
    },
  });
  return response.data.data;
}
