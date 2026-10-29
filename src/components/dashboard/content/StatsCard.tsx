"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
  className,
}: StatsCardProps) {
  const variantStyles = {
    default: "bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10",
    success: "bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10",
    warning: "bg-gradient-to-br from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-amber-950/10",
    destructive: "bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10",
    info: "bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/20 dark:to-purple-950/10",
  };

  const iconColors = {
    default: "text-blue-600 dark:text-blue-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-amber-600 dark:text-amber-400",
    destructive: "text-red-600 dark:text-red-400",
    info: "text-purple-600 dark:text-purple-400",
  };

  const trendColors = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-lg",
      variantStyles[variant],
      className
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-foreground tracking-tight">
              {value}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-2">
                {description}
              </p>
            )}
            {trend && (
              <div className={cn(
                "flex items-center gap-1 mt-3 text-sm font-medium",
                trendColors[trend.direction]
              )}>
                {trend.direction === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{trend.value}% from last month</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn(
              "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/50 dark:bg-black/20",
              iconColors[variant]
            )}>
              {icon}
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
    </Card>
  );
}
