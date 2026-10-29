import { Badge } from "@/components/ui/badge";
import { CLIENT_STATUS_BADGES } from "@/features/clients/constants/client.constant";
import type { ClientStatus } from "@/types/clients";
import { cn } from "@/lib/utils";

interface ClientStatusBadgeProps {
  status: ClientStatus;
  className?: string;
}

export function ClientStatusBadge({
  status,
  className,
}: ClientStatusBadgeProps) {
  const badge = CLIENT_STATUS_BADGES[status];

  if (!badge) return null;

  return (
    <Badge
      variant="secondary"
      className={cn(badge.className, className)}
    >
      {badge.label}
    </Badge>
  );
}
