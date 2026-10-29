"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LEAD_STATUS_CONFIG } from "@/features/leads/constants/lead.constant";
import { formatDateTime, getInitials, getLeadFullName } from "@/features/leads/utils/lead.utils";
import { LeadsTrashEmptyState } from "./leads-trash-empty-state";
import { LeadsTrashRowActions } from "./leads-trash-row-actions";
import { LeadsTableError, LeadsTableSkeleton } from "./leads-table-states";
import type { ILead } from "@/types/lead";

interface LeadsTrashTableProps {
  leads: ILead[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  hasActiveFilters: boolean;
  canPermanentlyDelete: boolean;
  onClearFilters: () => void;
  onRetry: () => void;
  onRestore: (lead: ILead) => void;
  onPermanentlyDelete: (lead: ILead) => void;
}

export function LeadsTrashTable({
  leads,
  isLoading,
  isError,
  errorMessage,
  hasActiveFilters,
  canPermanentlyDelete,
  onClearFilters,
  onRetry,
  onRestore,
  onPermanentlyDelete,
}: LeadsTrashTableProps) {
  return (
    <div className="rounded-lg border bg-accent/50 dark:bg-accent/20 border-border/70 shadow-sm">
      {isLoading ? (
        <LeadsTableSkeleton />
      ) : isError ? (
        <LeadsTableError message={errorMessage} onRetry={onRetry} />
      ) : leads.length === 0 ? (
        <LeadsTrashEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-cyan-800 *:text-white bg-indigo-600 rounded-xl">
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deleted At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const statusConfig = LEAD_STATUS_CONFIG[lead.status];

                return (
                  <TableRow key={lead._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {getInitials(lead.firstName, lead.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{getLeadFullName(lead)}</span>
                          <span className="text-xs text-muted-foreground">
                            {lead.email || "—"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {lead.company || "—"}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {lead.phone || "—"}
                    </TableCell>

                    <TableCell>
                      {lead.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">
                              {getInitials(
                                lead.assignedTo.firstName,
                                lead.assignedTo.lastName,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {getLeadFullName(lead.assignedTo)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(lead.deletedAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <LeadsTrashRowActions
                        lead={lead}
                        canPermanentlyDelete={canPermanentlyDelete}
                        onRestore={onRestore}
                        onPermanentlyDelete={onPermanentlyDelete}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
