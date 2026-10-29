"use client";

import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  timestamp: Date;
  type?: "success" | "warning" | "info" | "default";
  actionLabel?: string;
  onAction?: () => void;
}

export interface ActivityFeedProps {
  title?: string;
  items: ActivityItem[];
  maxItems?: number;
  isLoading?: boolean;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description?: string;
  };
  className?: string;
}

export function ActivityFeed({
  title = "Recent Activity",
  items,
  maxItems = 6,
  isLoading = false,
  emptyState,
  className,
}: ActivityFeedProps) {
  const displayItems = items.slice(0, maxItems);

  const typeColors = {
    success: "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400",
    warning: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
    info: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
    default: "bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400",
  };

  return (
    <Card className={cn("", className)}>
      <div className="p-6 border-b border-border/50">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      <div className="divide-y divide-border/50">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="p-12 text-center">
            {emptyState?.icon && (
              <div className="flex justify-center mb-4 text-muted-foreground">
                {emptyState.icon}
              </div>
            )}
            <h4 className="font-medium text-foreground mb-1">
              {emptyState?.title || "No activities yet"}
            </h4>
            {emptyState?.description && (
              <p className="text-sm text-muted-foreground">
                {emptyState.description}
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-muted/40 transition-colors"
              >
                <div className="flex gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                    typeColors[item.type || "default"]
                  )}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.actionLabel && (
                        <button
                          onClick={item.onAction}
                          className="text-xs text-primary hover:underline whitespace-nowrap"
                        >
                          {item.actionLabel}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > maxItems && (
        <div className="p-4 border-t border-border/50 text-center">
          <button className="text-sm font-medium text-primary hover:underline">
            View all activity
          </button>
        </div>
      )}
    </Card>
  );
}
