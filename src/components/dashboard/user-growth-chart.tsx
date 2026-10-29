"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GrowthData {
  month: string;
  users: number;
}

interface UserGrowthChartProps {
  data?: GrowthData[];
  growth?: number;
  growthLabel?: string;
  isLoading?: boolean;
}

export function UserGrowthChart({
  data,
  growth = 12.2,
  growthLabel = "vs last year",
  isLoading = false,
}: UserGrowthChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user growth</CardDescription>
            </div>
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [
    { month: "Jan", users: 2000 },
    { month: "Feb", users: 3500 },
    { month: "Mar", users: 5200 },
    { month: "Apr", users: 4800 },
    { month: "May", users: 6200 },
    { month: "Jun", users: 7100 },
    { month: "Jul", users: 6800 },
    { month: "Aug", users: 8900 },
    { month: "Sep", users: 9200 },
    { month: "Oct", users: 8500 },
    { month: "Nov", users: 10200 },
    { month: "Dec", users: 12540 },
  ];

  return (
    <Card className="bg-gray-100 dark:bg-slate-950">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user growth</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">12,540</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              ↑ {growth}% {growthLabel}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "0.875rem" }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "0.875rem" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Bar
              dataKey="users"
              fill="#6366f1"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
