/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CLIENT_STATUS_BADGES } from "@/features/clients/constants/client.constant";
import {
  getClientFullName,
  getClientInitials,
} from "@/features/clients/utils/client.utils";
import { cn } from "@/lib/utils";
import type { IClient } from "@/types/clients";

import { ClientTrashRowActions } from "./client-trash-row-actions";

interface ClientsTrashTableProps {
  clients: IClient[];
  isLoading: boolean;
  canPermanentlyDelete: boolean;
  emptyState: React.ReactNode;
  onRestore: (client: IClient) => void;
  onPermanentlyDelete: (client: IClient) => void;
}

function formatDeletedDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const COLUMN_COUNT = 7;

export function ClientsTrashTable({
  clients,
  isLoading,
  canPermanentlyDelete,
  emptyState,
  onRestore,
  onPermanentlyDelete,
}: ClientsTrashTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-gray-100 dark:bg-slate-950 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-cyan-800 *:text-white bg-indigo-600">
            <TableHead>Client</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Account Manager</TableHead>
            <TableHead>Deleted By</TableHead>
            <TableHead>Deleted At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {Array.from({ length: COLUMN_COUNT }).map((__, cellIndex) => (
                  <TableCell key={`skeleton-cell-${cellIndex}`}>
                    <div className="h-4 w-full max-w-35 animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMN_COUNT} className="p-0">
                {emptyState}
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => {
              const statusConfig = CLIENT_STATUS_BADGES[client.status];

              return (
                <TableRow key={client._id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                          {getClientInitials(client)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-sm font-medium text-foreground">
                          {getClientFullName(client)}
                        </span>
                        <span className="truncate text-xs text-gray-800 dark:text-gray-200">
                          {client.clientCode}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {client.companyName || "—"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs text-gray-800 dark:text-gray-200">
                      <span>{client.leadId?.phone || "—"}</span>
                      <span className="truncate">{client.leadId?.email || "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {client.accountManager
                        ? getClientFullName(client.accountManager as any)
                        : "Unassigned"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {client.deletedBy ? getClientFullName(client.deletedBy as any) : "—"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-gray-800 dark:text-gray-200">
                      {formatDeletedDate(client.deletedAt)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {statusConfig && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "hidden rounded-md border-transparent px-2 py-0.5 font-medium sm:inline-flex",
                            statusConfig.className,
                          )}
                        >
                          {statusConfig.label}
                        </Badge>
                      )}
                      <ClientTrashRowActions
                        client={client}
                        canPermanentlyDelete={canPermanentlyDelete}
                        onRestore={onRestore}
                        onPermanentlyDelete={onPermanentlyDelete}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
