import { Card, CardContent } from "@/components/ui/card";
import type { IClient } from "@/types/clients";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ClientInfoCardProps {
  client?: Partial<IClient> | null;
  className?: string;
}

export function ClientInfoCard({
  client,
  className,
}: ClientInfoCardProps) {
  if (!client) return null;

  const infoItems = [
    { icon: Mail, label: "Email", value: client.leadId?.email },
    { icon: Phone, label: "Phone", value: client.leadId?.phone },
    {
      icon: MapPin,
      label: "Location",
      value:
        client.city && client.state
          ? `${client.city}, ${client.state}`
          : client.city,
    },
    {
      icon: Calendar,
      label: "Joined",
      value: client.joinedAt
        ? format(new Date(client.joinedAt), "MMM dd, yyyy")
        : undefined,
    },
  ];

  return (
    <Card className={cn("rounded-xl border-0 shadow-sm", className)}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {infoItems.map(
            (item, index) =>
              item.value && (
                <div key={index} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
