"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "secondary" | "outline" | "ghost";
  disabled?: boolean;
}

export interface QuickActionsProps {
  title?: string;
  description?: string;
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function QuickActions({
  title = "Quick Actions",
  description,
  actions,
  columns = 3,
  className,
}: QuickActionsProps) {
  const gridClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={cn("grid gap-4", gridClasses[columns])}>
        {actions.map((action) => (
          <Card
            key={action.id}
            className={cn(
              "group relative overflow-hidden transition-all hover:shadow-lg cursor-pointer",
              "bg-card border border-border/50 hover:border-border"
            )}
            onClick={action.onClick}
            role={action.onClick ? "button" : undefined}
            tabIndex={action.onClick ? 0 : undefined}
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </p>
                  {action.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Subtle hover effect background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </Card>
        ))}
      </div>
    </div>
  );
}
