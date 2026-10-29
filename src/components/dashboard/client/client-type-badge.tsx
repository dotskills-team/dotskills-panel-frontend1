import { Badge } from "@/components/ui/badge";
import { CLIENT_TYPE_BADGES } from "@/features/clients/constants/client.constant";
import type { ClientType } from "@/types/clients";
import { cn } from "@/lib/utils";

interface ClientTypeBadgeProps {
  type: ClientType;
  className?: string;
}

export function ClientTypeBadge({
  type,
  className,
}: ClientTypeBadgeProps) {
  const badge = CLIENT_TYPE_BADGES[type];

  if (!badge) return null;

  return (
    <Badge
      variant="outline"
      className={cn(badge.className, className)}
    >
      {badge.label}
    </Badge>
  );
}
