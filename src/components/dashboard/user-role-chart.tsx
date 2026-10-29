"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface RoleData {
  name: string;
  value: number;
  color: string;
}

interface UserRoleChartProps {
  data?: RoleData[];
  isLoading?: boolean;
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export function UserRoleChart({ data, isLoading = false }: UserRoleChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
          <CardDescription>Distribution of user roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [
    { name: "Super Admin", value: 12, color: "#6366f1" },
    { name: "Admin", value: 45, color: "#8b5cf6" },
    { name: "Instructor", value: 320, color: "#10b981" },
    { name: "Student", value: 2150, color: "#f59e0b" },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="bg-gray-100 dark:bg-slate-950">
      <CardHeader>
        <CardTitle>Users by Role</CardTitle>
        <CardDescription>Distribution of user roles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((item, idx) => (
                  <Cell key={`cell-${idx}`} fill={item.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-3xl font-bold">{total.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-6">
          {chartData.map((role) => (
            <div key={role.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: role.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{role.name}</p>
                <p className="text-xs text-muted-foreground">
                  {role.value} ({((role.value / total) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
