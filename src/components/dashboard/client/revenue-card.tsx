import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrency,
  calculateCollectionPercentage,
} from "@/features/clients/utils/client.utils";
import { Progress } from "@/components/ui/progress";
import type { IClient } from "@/types/clients";

interface RevenueCardProps {
  client?: Partial<IClient> | null;
}

export function RevenueCard({ client }: RevenueCardProps) {
  if (!client) return null;

  const collectionPercentage = calculateCollectionPercentage(
    client.totalPaid,
    client.totalRevenue
  );

  return (
    <Card className="rounded-xl border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Financial Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Revenue</span>
            <span className="text-base font-semibold">
              {formatCurrency(client.totalRevenue)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Paid: {formatCurrency(client.totalPaid)}</span>
            <span>Due: {formatCurrency(client.totalDue)}</span>
          </div>
          <Progress value={collectionPercentage} className="h-1.5" />
          <div className="text-xs text-muted-foreground">
            {collectionPercentage}% collected
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
