"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardWithChartProps {
  title: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  chartColor: string;
  chartData: Array<{ value: number }>;
  isLoading?: boolean;
  prefix?: string;
  suffix?: string;
}

export function StatCardWithChart({
  title,
  value,
  trend,
  trendLabel = "vs last 30 days",
  icon: Icon,
  iconBgColor,
  iconColor,
  chartColor,
  chartData,
  isLoading = false,
  prefix = "",
  suffix = "",
}: StatCardWithChartProps) {
  const isTrendPositive = trend && trend >= 0;
  
  return (
    <Card className="hover:shadow-lg bg-gray-100 dark:bg-slate-950 transition-all duration-200 overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {isLoading ? (
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-bold">
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value}
              {suffix}
            </div>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", iconBgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-sm font-medium",
                isTrendPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {isTrendPositive ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-muted-foreground">{trendLabel}</span>
          </div>
        )}
        {chartData && chartData.length > 0 && !isLoading && (
          <div className="h-12 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
