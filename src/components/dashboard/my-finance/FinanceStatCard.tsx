"use client";

import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FinanceStatCardProps {
  title: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  /** Icon colour classes, e.g. "text-blue-100". */
  tone: string;
  /** Background gradient classes, e.g. "from-blue-600 via-indigo-600 to-violet-600". */
  gradient: string;
}

/** Gradient stat card, same design as the stats on the admin Expenses page. */
export function FinanceStatCard({ title, value, caption, icon: Icon, tone, gradient }: FinanceStatCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border-0",
        "bg-linear-to-br text-white shadow-lg",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        gradient,
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 size-28 rounded-full bg-black/5" />

      <CardContent className="relative flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            "bg-white/15 backdrop-blur-sm ring-1 ring-white/10",
            tone,
          )}
        >
          <Icon className="size-6" strokeWidth={2.2} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-white/75">{title}</p>
          <p className="mt-1 truncate text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 truncate text-[11px] text-white/65">{caption}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default FinanceStatCard;
