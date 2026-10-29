"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeletedClients, useClientMutations } from "@/features/clients/hooks";
import { getClientFullName } from "@/features/clients/utils/client.utils";
import { exportClients } from "@/features/clients/utils/export.utils";
import { useAuthStore } from "@/stores";
import { Role } from "@/types";
import type { ClientFilters, IClient } from "@/types/clients";

import { ClientsTrashEmptyState } from "./clients-trash-empty-state";
import { ClientsTrashTable } from "./clients-trash-table";
import { ClientsTrashToolbar } from "./clients-trash-toolbar";
import { ProjectsPagination } from "../../project/ProjectPagination";

export function ClientsTrashPageClient() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  // Debounce search, reset to page 1 when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filters: ClientFilters = {
    page,
    limit,
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
    ...(status ? { status: status as ClientFilters["status"] } : {}),
  };

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useDeletedClients(filters);

  const clients: IClient[] = response?.data ?? [];
  const meta = response?.meta;

  // If the last item on the last page was removed, step back a page
  useEffect(() => {
    if (meta && meta.totalPage > 0 && page > meta.totalPage) {
      setPage(meta.totalPage);
    }
  }, [meta, page]);

  const { restoreClient, permanentlyDeleteClient } = useClientMutations();

  const currentRole = useAuthStore((state) => state.user?.role);
  const canPermanentlyDelete = currentRole === Role.SUPER_ADMIN;

  const [restoreTarget, setRestoreTarget] = useState<IClient | null>(null);
  const [restoreOpen, setRestoreOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<IClient | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const hasActiveFilters = Boolean(searchTerm) || Boolean(status);

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function handleLimitChange(value: number) {
    setLimit(value);
    setPage(1);
  }

  function handleClearFilters() {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatus("");
    setPage(1);
  }

  function handleRestoreRequest(client: IClient) {
    setRestoreTarget(client);
    setRestoreOpen(true);
  }

  function handleConfirmRestore() {
    if (!restoreTarget) return;

    restoreClient.mutate(restoreTarget._id, {
      onSuccess: () => {
        toast.success(`${getClientFullName(restoreTarget)} restored successfully.`);
        setRestoreOpen(false);
        setRestoreTarget(null);
      },
      onError: () => toast.error("Failed to restore client."),
    });
  }

  function handleDeleteRequest(client: IClient) {
    setDeleteTarget(client);
    setDeleteOpen(true);
  }

  function handleConfirmPermanentDelete() {
    if (!deleteTarget) return;

    permanentlyDeleteClient.mutate(deleteTarget._id, {
      onSuccess: () => {
        toast.success(`${getClientFullName(deleteTarget)} permanently deleted.`);
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to permanently delete client."),
    });
  }

  function handleExport() {
    if (clients.length === 0) {
      toast.error("There are no deleted clients to export.");
      return;
    }

    exportClients(clients, {
      filename: `clients-trash-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    toast.success("Trash exported successfully.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Clients Trash
        </h1>
        <p className="text-sm text-muted-foreground">
          Deleted clients are kept here until restored or permanently removed.
        </p>
      </div>

      <ClientsTrashToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        status={status}
        onStatusChange={handleStatusChange}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExport}
        exportDisabled={clients.length === 0}
      />

      <ClientsTrashTable
        clients={clients}
        isLoading={isLoading}
        canPermanentlyDelete={canPermanentlyDelete}
        onRestore={handleRestoreRequest}
        onPermanentlyDelete={handleDeleteRequest}
        emptyState={
          <ClientsTrashEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        }
      />

      {meta && meta.total > 0 && (
        <ProjectsPagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPage={meta.totalPage}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
        />
      )}

      <ConfirmDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        title="Restore this client?"
        description={`${
          restoreTarget ? getClientFullName(restoreTarget) : "This client"
        } will move back to your active client list.`}
        confirmText="Restore Client"
        isLoading={restoreClient.isPending}
        onConfirm={handleConfirmRestore}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Permanently delete this client?"
        description={`This will permanently remove ${
          deleteTarget ? getClientFullName(deleteTarget) : "this client"
        } along with all of their notes and documents. This action cannot be undone.`}
        confirmText="Delete Permanently"
        variant="destructive"
        isLoading={permanentlyDeleteClient.isPending}
        onConfirm={handleConfirmPermanentDelete}
      />
    </div>
  );
}