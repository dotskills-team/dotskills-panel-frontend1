// "use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowUpRight,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IClientStats } from "@/types/clients";

const stats: {
  icon: typeof Users;
  label: string;
  key: keyof IClientStats;
  color: string;
  format: (value: number) => string;
}[] = [
  {
    icon: Users,
    label: "Total Clients",
    key: "total",
    color: "from-blue-500 to-blue-600",
    format: formatNumber,
  },
  {
    icon: TrendingUp,
    label: "Active Clients",
    key: "Active",
    color: "from-emerald-500 to-emerald-600",
    format: formatNumber,
  },
  {
    icon: Banknote ,
    label: "Total Revenue",
    key: "totalRevenue",
    color: "from-amber-500 to-amber-600",
    format: formatCurrency,
  },
  {
    icon: Briefcase,
    label: "Total Projects",
    key: "totalProjects",
    color: "from-purple-500 to-purple-600",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const statValue = clientStats?.[stat.key] ?? 0;

        return (
          <Card
            key={stat.key}
            className="rounded-xl border-0 bg-linear-to-br bg-gray-100 dark:bg-slate-900 ease-in-out duration-300 transform hover:bg-slate-100 hover:scale-103 transition-all shadow-sm overflow-hidden hover:shadow-md"
          >
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold">
                        {stat.format(statValue)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center text-white bg-linear-to-br",
                        stat.color,
                      )}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  {stat.key === "Active" && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>{activePercent}% of total</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}