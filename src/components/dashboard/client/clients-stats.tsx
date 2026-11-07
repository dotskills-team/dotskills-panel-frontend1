// "use client";

import { FinanceStatCard } from "@/components/dashboard/my-finance/FinanceStatCard";
import { useClientStats } from "@/features/clients/hooks";
import {
  formatCurrency,
  formatNumber,
} from "@/features/clients/utils/client.utils";
import {
  Users,
  TrendingUp,
  DollarSign,
  Briefcase,
  Banknote,
} from "lucide-react";
import type { IClientStats } from "@/types/clients";

const stats: {
  icon: typeof Users;
  label: string;
  key: keyof IClientStats;
  tone: string;
  gradient: string;
  caption: string;
  format: (value: number) => string;
}[] = [
  {
    icon: Users,
    label: "Total Clients",
    key: "total",
    tone: "text-blue-100",
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    caption: "All clients",
    format: formatNumber,
  },
  {
    icon: TrendingUp,
    label: "Active Clients",
    key: "Active",
    tone: "text-emerald-100",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    caption: "",
    format: formatNumber,
  },
  {
    icon: Banknote ,
    label: "Total Revenue",
    key: "totalRevenue",
    tone: "text-amber-100",
    gradient: "from-amber-500 via-orange-500 to-orange-600",
    caption: "Lifetime revenue",
    format: formatCurrency,
  },
  {
    icon: Briefcase,
    label: "Total Projects",
    key: "totalProjects",
    tone: "text-violet-100",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-700",
    caption: "Across all clients",
    format: formatNumber,
  },
];

export function ClientsStats() {
  const { stats: clientStats, isLoading } = useClientStats();

  const activePercent =
    clientStats?.total > 0
      ? Math.round((clientStats.Active / clientStats.total) * 100)
      : 0;

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <FinanceStatCard
          key={stat.key}
          title={stat.label}
          value={stat.format(clientStats?.[stat.key] ?? 0)}
          caption={stat.key === "Active" ? `${activePercent}% of total` : stat.caption}
          icon={stat.icon}
          tone={stat.tone}
          gradient={stat.gradient}
          loading={isLoading}
        />
      ))}
    </div>
  );
}
