"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface WelcomeBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  variant?: "default" | "success" | "info" | "warning";
  dismissible?: boolean;
  className?: string;
}

export function WelcomeBanner({
  title,
  subtitle,
  description,
  icon,
  actionLabel,
  onAction,
  onDismiss,
  variant = "default",
  dismissible = true,
  className,
}: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const variantStyles = {
    default: "bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-600 dark:to-blue-500",
    success: "bg-gradient-to-r from-green-600 to-green-500 dark:from-green-600 dark:to-green-500",
    info: "bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-600 dark:to-purple-500",
    warning: "bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-600 dark:to-amber-500",
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border-0 shadow-lg",
        variantStyles[variant],
        className
      )}
    >
      <div className="relative px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex gap-4 flex-1 min-w-0">
            {icon && (
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center text-white">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-white/90 mt-1">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="text-sm text-white/80 mt-2 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            {actionLabel && onAction && (
              <Button
                onClick={onAction}
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
              >
                {actionLabel}
              </Button>
            )}
            {dismissible && (
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>
      </div>
    </Card>
  );
}
