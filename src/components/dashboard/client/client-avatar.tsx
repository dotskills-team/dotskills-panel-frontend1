import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IClient } from "@/types/clients";
import { getClientInitials } from "@/features/clients/utils/client.utils";
import { cn } from "@/lib/utils";

interface ClientAvatarProps {
  client?: Partial<IClient> | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function ClientAvatar({
  client,
  size = "md",
  className,
}: ClientAvatarProps) {
  const initials = getClientInitials(client);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={`https://avatar.vercel.sh/${client?.leadId?.email}`}
        alt={initials}
      />
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
