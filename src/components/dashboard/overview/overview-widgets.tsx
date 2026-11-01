"use client";

import type { ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Banknote,
  Building2,
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  HandCoins,
  Landmark,
  Percent,
  Receipt,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  DashboardBreakdown,
  DashboardKpi,
  DashboardList,
  DashboardTone,
  DashboardTrend,
} from "@/types/dashboard.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FinanceStatCard } from "@/components/dashboard/my-finance/FinanceStatCard";
import { formatMoney } from "@/components/dashboard/my-finance/finance-format";
import { formatDate } from "@/utils/dateFormat";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              Design constants                              */
/* -------------------------------------------------------------------------- */

// Full class names so Tailwind picks them up.
const TONE_GRADIENT: Record<DashboardTone, string> = {
  indigo: "from-indigo-600 via-indigo-600 to-violet-600",
  emerald: "from-emerald-500 via-teal-600 to-cyan-700",
  rose: "from-rose-500 via-pink-600 to-fuchsia-600",
  amber: "from-amber-500 via-orange-500 to-red-500",
  violet: "from-violet-600 via-purple-600 to-fuchsia-700",
  sky: "from-sky-500 via-blue-600 to-indigo-700",
  teal: "from-teal-500 via-cyan-600 to-sky-700",
  blue: "from-blue-500 via-blue-600 to-blue-800",
};

const TONE_ICON_COLOR: Record<DashboardTone, string> = {
  indigo: "text-indigo-100",
  emerald: "text-emerald-100",
  rose: "text-rose-100",
  amber: "text-amber-100",
  violet: "text-violet-100",
  sky: "text-sky-100",
  teal: "text-teal-100",
  blue: "text-blue-100",
};

const KPI_ICONS: Record<string, LucideIcon> = {
  collected: HandCoins,
  expenses: Receipt,
  net: TrendingUp,
  outstanding: AlertCircle,
  dues: AlertCircle,
  salaryDue: Banknote,
  salaryReceived: Wallet,
  openLeads: Target,
  leads: Target,
  thisMonthLeads: UserPlus,
  conversion: Percent,
  clients: Building2,
  myBalance: Landmark,
  team: Users,
  myProjects: FolderKanban,
  assigned: FolderKanban,
  active: Activity,
  finished: CheckCircle2,
  overdue: CalendarClock,
  dueSoon: CalendarClock,
};

const PALETTE = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#0ea5e9", "#8b5cf6", "#14b8a6", "#ec4899"];

const formatValue = (value: number, format: DashboardKpi["format"]) => {
  if (format === "currency") return formatMoney(value);
  if (format === "percent") return `${value}%`;
  return value.toLocaleString("en-US");
};

const compact = (value: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

/* -------------------------------------------------------------------------- */
/*                                    KPIs                                    */
/* -------------------------------------------------------------------------- */

export function KpiGrid({ kpis }: { kpis: DashboardKpi[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <FinanceStatCard
          key={kpi.key}
          title={kpi.label}
          value={formatValue(kpi.value, kpi.format)}
          caption={kpi.hint}
          icon={KPI_ICONS[kpi.key] ?? BarChart3}
          tone={TONE_ICON_COLOR[kpi.tone]}
          gradient={TONE_GRADIENT[kpi.tone]}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Charts                                    */
/* -------------------------------------------------------------------------- */

// Recharts defaults its tooltip and legend text to black, which disappears on dark
// backgrounds. Every text colour is set explicitly, with light and dark variants.
const tooltipStyle = {
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 12,
};

const tooltipTextProps = {
  labelStyle: { color: "var(--popover-foreground)", fontWeight: 600 },
  itemStyle: { color: "var(--popover-foreground)" },
};

const legendText = (value: string) => (
  <span className="text-slate-700 dark:text-slate-200">{value}</span>
);

const CHART_TEXT = "text-slate-600 dark:text-slate-300";

const axisTick = { fill: "currentColor", fontSize: 12 };

export function TrendCard({ trend, className }: { trend: DashboardTrend; className?: string }) {
  const hasData = trend.points.some((point) =>
    trend.keys.some((k) => Number(point[k.key] ?? 0) > 0),
  );

  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <CardTitle className="text-base">{trend.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <EmptyState text="No activity in the last six months yet." />
        ) : (
          <div className={cn("h-72", CHART_TEXT)}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend.points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {trend.keys.map((k) => (
                    <linearGradient key={k.key} id={`grad-${k.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={k.color} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={k.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => compact(Number(v))} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  {...tooltipTextProps}
                  formatter={(value) => formatMoney(Number(value))}
                />
                <Legend formatter={legendText} />
                {trend.keys.map((k) => (
                  <Area
                    key={k.key}
                    type="monotone"
                    dataKey={k.key}
                    name={k.label}
                    stroke={k.color}
                    strokeWidth={2}
                    fill={`url(#grad-${k.key})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function BreakdownCard({ breakdown }: { breakdown: DashboardBreakdown }) {
  const total = breakdown.items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base">{breakdown.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <EmptyState text="No data yet." />
        ) : breakdown.type === "donut" ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown.items}
                    dataKey="value"
                    nameKey="label"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {breakdown.items.map((item, i) => (
                      <Cell key={item.label} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} {...tooltipTextProps} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="grid w-full gap-2 text-sm">
              {breakdown.items.map((item, i) => (
                <li key={item.label} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: PALETTE[i % PALETTE.length] }}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="font-semibold">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={cn("h-60", CHART_TEXT)}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdown.items} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                <XAxis dataKey="label" tick={{ ...axisTick, fontSize: 11 }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  {...tooltipTextProps}
                  cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                />
                <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                  {breakdown.items.map((item, i) => (
                    <Cell key={item.label} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Lists                                   */
/* -------------------------------------------------------------------------- */

export function ListCard({ list }: { list: DashboardList }) {
  const money = list.valueFormat !== "number";

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base">{list.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {list.rows.length === 0 ? (
          <EmptyState text="Nothing to show yet." />
        ) : (
          <ul className="divide-y">
            {list.rows.map((row, i) => (
              <li key={`${row.primary}-${i}`} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{row.primary}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[row.secondary, row.date ? formatDate(row.date) : null].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {row.value !== undefined && (
                    <span className="text-sm font-semibold">
                      {money ? formatMoney(row.value) : row.value.toLocaleString("en-US")}
                    </span>
                  )}
                  {row.badge && (
                    <Badge variant="outline" className="text-[10px]">
                      {row.badge}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

export function EmptyState({ text }: { text: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{text}</p>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold tracking-tight">{children}</h2>;
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-1/3 rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}
