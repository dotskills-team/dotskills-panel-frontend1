/** Mirrors the response of GET /dashboard/overview (backend dashboard.service.ts). */

export type DashboardTone =
  | "indigo"
  | "emerald"
  | "rose"
  | "amber"
  | "violet"
  | "sky"
  | "teal"
  | "blue";

export interface DashboardKpi {
  key: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  hint: string;
  tone: DashboardTone;
}

export interface DashboardTrend {
  title: string;
  keys: { key: string; label: string; color: string }[];
  points: Array<Record<string, string | number>>;
}

export interface DashboardBreakdown {
  key: string;
  title: string;
  type: "donut" | "bar";
  items: { label: string; value: number }[];
}

export interface DashboardListRow {
  primary: string;
  secondary?: string;
  value?: number;
  badge?: string;
  date?: string;
}

export interface DashboardList {
  key: string;
  title: string;
  valueFormat?: "currency" | "number";
  rows: DashboardListRow[];
}

export interface DashboardRangeParams {
  /** YYYY-MM-DD */
  startDate?: string;
  /** YYYY-MM-DD */
  endDate?: string;
}

export interface DashboardOverview {
  role: string;
  name: string;
  generatedAt: string;
  range: { startDate: string; endDate: string };
  kpis: DashboardKpi[];
  /** null when the role's dashboard has no trend chart (managers). */
  trend: DashboardTrend | null;
  breakdowns: DashboardBreakdown[];
  lists: DashboardList[];
}
