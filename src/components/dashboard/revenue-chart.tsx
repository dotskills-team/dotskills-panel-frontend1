"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  date: string;
  revenue: number;
  expenses: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  isLoading?: boolean;
}

export function RevenueChart({ data = [], isLoading = false }: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.length > 0 ? data : generateMockData();

  return (
    <Card className="bg-gray-100 dark:bg-slate-950">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="date"
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
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Mock data generator for demo purposes
function generateMockData(): RevenueData[] {
  const dates = ["May 18", "May 25", "Jun 01", "Jun 08", "Jun 15", "Jun 18"];
  return dates.map((date) => ({
    date,
    revenue: Math.floor(Math.random() * 40000) + 15000,
    expenses: Math.floor(Math.random() * 15000) + 8000,
  }));
}
