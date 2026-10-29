"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeletedLeads, useLeadFilters, useLeadMutations } from "@/features/leads/hooks";
import { exportLeadsToCsv } from "@/features/leads/utils/export-leads";
import { getLeadFullName } from "@/features/leads/utils/lead.utils";
import { useAuthStore } from "@/stores";
import { Role } from "@/types";
import type { ILead, LeadStatus } from "@/types/lead";

import { LeadsPagination } from "./leads-pagination";
import { LeadsTrashTable } from "./leads-trash-table";
import { LeadsTrashToolbar } from "./leads-trash-toolbar";

export function LeadsTrashPageClient() {
  const {
    filters,
    queryFilters,
    setSearchTerm,
    updateFilters,
    setPage,
    setLimit,
    resetFilters,
    activeFilterCount,
  } = useLeadFilters();

  const { data, isLoading, isFetching, isError, error, refetch } =
    useDeletedLeads(queryFilters);
  const { restoreLead, permanentlyDeleteLead } = useLeadMutations();

  const currentRole = useAuthStore((state) => state.user?.role);
  const canPermanentlyDelete = currentRole === Role.SUPER_ADMIN;

  const leads = data?.data ?? [];
  const meta = data?.meta;

  const [restoreTarget, setRestoreTarget] = useState<ILead | null>(null);
  const [restoreOpen, setRestoreOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ILead | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const hasActiveFilters = activeFilterCount > 0 || Boolean(filters.searchTerm);

  function handleClearFilters() {
    resetFilters();
  }

  function handleRestoreRequest(lead: ILead) {
    setRestoreTarget(lead);
    setRestoreOpen(true);
  }

  function handleConfirmRestore() {
    if (!restoreTarget) return;

    restoreLead.mutate(restoreTarget._id, {
      onSuccess: () => {
        toast.success(`${getLeadFullName(restoreTarget)} restored successfully.`);
        setRestoreOpen(false);
        setRestoreTarget(null);
      },
      onError: () => toast.error("Failed to restore lead."),
    });
  }

  function handleDeleteRequest(lead: ILead) {
    setDeleteTarget(lead);
    setDeleteOpen(true);
  }

  function handleConfirmPermanentDelete() {
    if (!deleteTarget) return;

    permanentlyDeleteLead.mutate(deleteTarget._id, {
      onSuccess: () => {
        toast.success(`${getLeadFullName(deleteTarget)} permanently deleted.`);
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to permanently delete lead."),
    });
  }

  function handleExport() {
    if (leads.length === 0) {
      toast.error("There are no deleted leads to export.");
      return;
    }

    exportLeadsToCsv(leads);
    toast.success("Trash exported successfully.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Leads Trash
        </h1>
        <p className="text-sm text-muted-foreground">
          Deleted leads are kept here until restored or permanently removed.
        </p>
      </div>

      <LeadsTrashToolbar
        searchTerm={filters.searchTerm ?? ""}
        onSearchChange={setSearchTerm}
        status={(filters.status as LeadStatus) ?? ""}
        onStatusChange={(status) => updateFilters({ status: status || undefined })}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExport}
        exportDisabled={leads.length === 0}
      />

      <LeadsTrashTable
        leads={leads}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        hasActiveFilters={hasActiveFilters}
        canPermanentlyDelete={canPermanentlyDelete}
        onClearFilters={handleClearFilters}
        onRetry={() => refetch()}
        onRestore={handleRestoreRequest}
        onPermanentlyDelete={handleDeleteRequest}
      />

      {meta && leads.length > 0 && (
        <LeadsPagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPage={meta.totalPage}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}

      <ConfirmDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        title="Restore this lead?"
        description={`${
          restoreTarget ? getLeadFullName(restoreTarget) : "This lead"
        } will move back to your active leads list.`}
        confirmText="Restore Lead"
        isLoading={restoreLead.isPending}
        onConfirm={handleConfirmRestore}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Permanently delete this lead?"
        description={`This will permanently remove ${
          deleteTarget ? getLeadFullName(deleteTarget) : "this lead"
        } along with all of their notes and attachments. This action cannot be undone.`}
        confirmText="Delete Permanently"
        variant="destructive"
        isLoading={permanentlyDeleteLead.isPending}
        onConfirm={handleConfirmPermanentDelete}
      />
    </div>
  );
}
