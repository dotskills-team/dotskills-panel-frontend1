"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  EXPIRY_TONE_CLASS,
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  formatDaysLeft,
  getExpiryTone,
} from "@/features/domain-hosting/constants/domain-hosting.constant";
import type { RenewalStatus } from "@/types/domain-hosting.types";

export function StatusBadge({ status }: { status: RenewalStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATUS_BADGE_CLASS[status])}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

/** Colour-coded "days left" badge: red expired, orange <= 7 days, yellow <= 30 days, green otherwise. */
export function ExpiryBadge({ daysLeft }: { daysLeft: number }) {
  const tone = getExpiryTone(daysLeft);

  return (
    <Badge variant="outline" className={cn("whitespace-nowrap font-medium", EXPIRY_TONE_CLASS[tone])}>
      {formatDaysLeft(daysLeft)}
    </Badge>
  );
}
