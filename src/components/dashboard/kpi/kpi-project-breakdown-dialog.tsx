"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useKpiProjectBreakdown } from "@/features/kpi/hooks/use-kpi";
import { formatBdt, formatMonthLabel } from "@/features/kpi/utils/kpi.utils";
import { formatDate } from "@/lib/format";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: string;
  userId?: string;
  userName?: string;
}

/** Admin only: the page never mounts this for other roles, and the endpoint rejects them anyway. */
export function KpiProjectBreakdownDialog({ open, onOpenChange, month, userId, userName }: Props) {
  const query = useKpiProjectBreakdown(month, userId, open && Boolean(userId));
  const data = query.data?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Projects credited to {userName ?? "member"}</DialogTitle>
          <DialogDescription>
            {formatMonthLabel(month)}. Cancelled and deleted projects are not counted.
          </DialogDescription>
        </DialogHeader>

        {query.isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : query.isError ? (
          <p className="py-8 text-center text-sm text-red-500">Could not load the project breakdown.</p>
        ) : !data || data.projects.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No projects credited to this member in {formatMonthLabel(month)}.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.projects.map((p) => (
                <TableRow key={p.projectId}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.client?.name ?? "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(p.createdAt)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatBdt(p.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-medium">
                  Total ({data.totals.achievedProjects} project{data.totals.achievedProjects === 1 ? "" : "s"})
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatBdt(data.totals.achievedSales)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
