"use client";

import { useCallback, useMemo, useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useLeads } from "@/features/leads/hooks";
import { useLeadMutations } from "@/features/leads/hooks";
import { useLeadFilters } from "@/features/leads/hooks/use-lead-filters";
import { exportLeadsToCsv } from "@/features/leads/utils/export-leads";
import { LeadsHeader } from "./leads-header";
import { LeadsStats } from "./leads-stats";
import { LeadsToolbar } from "./leads-toolbar";
import { LeadsTable } from "./leads-table";
import { LeadsPagination } from "./leads-pagination";
import { LeadsBulkActionsBar } from "./leads-bulk-actions-bar";
import { LeadFormDialog } from "./lead-form-dialog";
import { LeadAssignDialog } from "./lead-assign-dialog";
import { LeadConvertDialog } from "./lead-convert-dialog";
import { LeadDetailsDrawer } from "./lead-details-drawer";
import { LeadImportDialog } from "./lead-import-dialog";
import { LeadContactStatusDialog } from "./lead-contact-status-dialog";
import type { ILead, LeadStatus } from "@/types/lead";

export function LeadsPageClient() {
  const {
    filters,
    queryFilters,
    updateFilters,
    setPage,
    setLimit,
    setSearchTerm,
    setSort,
    resetFilters,
    activeFilterCount,
  } = useLeadFilters();

  const { data, isLoading, isError, error, refetch } = useLeads(queryFilters);
  const { assignLead, trashLead, updateLeadStatus } = useLeadMutations();
  const [contactStatusLead, setContactStatusLead] = useState<ILead | null>(null);
  const [contactStatusOpen, setContactStatusOpen] = useState(false);
  console.log("leads ", data);
  const handleUpdateStatus = useCallback(
    (lead: ILead, status?: LeadStatus) => {
      if (!status) return;

      updateLeadStatus.mutate(
        {
          id: lead._id,
          payload: {
            status,
          },
        },
        {
          onSuccess: () => {
            toast.success("Lead status updated.");
          },
          onError: () => {
            toast.error("Failed to update lead status.");
          },
        },
      );
    },
    [updateLeadStatus],
  );

  const leads = data?.data ?? [];
  const meta = data?.meta;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const selectedIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);

  const [detailsLeadId, setDetailsLeadId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editLead, setEditLead] = useState<ILead | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const [assignLeadTarget, setAssignLeadTarget] = useState<ILead | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  const [convertLeadTarget, setConvertLeadTarget] = useState<ILead | null>(null);
  const [convertOpen, setConvertOpen] = useState(false);

  const [deleteLeadTarget, setDeleteLeadTarget] = useState<ILead | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);

  // Lead import dialog — state only, all import logic lives in LeadImportDialog.
  const [importOpen, setImportOpen] = useState(false);

  const handleOpenDetails = useCallback((lead: ILead) => {
    setDetailsLeadId(lead._id);
    setDetailsOpen(true);
  }, []);

  const handleEdit = useCallback((lead: ILead) => {
    setFormMode("edit");
    setEditLead(lead);
    setFormOpen(true);
  }, []);

  const handleAddLead = useCallback(() => {
    setFormMode("create");
    setEditLead(null);
    setFormOpen(true);
  }, []);

  const handleUpdateContactStatus = useCallback((lead: ILead) => {
    setContactStatusLead(lead);
    setContactStatusOpen(true);
  }, []);

  const handleAssign = useCallback((lead: ILead) => {
    setAssignLeadTarget(lead);
    setAssignOpen(true);
  }, []);

  const handleConvert = useCallback((lead: ILead) => {
    setConvertLeadTarget(lead);
    setConvertOpen(true);
  }, []);

  const handleDelete = useCallback((lead: ILead) => {
    setDeleteLeadTarget(lead);
    setDeleteOpen(true);
  }, []);

  const handleConfirmDelete = () => {
    if (!deleteLeadTarget) return;

    trashLead.mutate(deleteLeadTarget._id, {
      onSuccess: () => {
        toast.success("Lead moved to trash.");
        setDeleteOpen(false);
      },
      onError: () => toast.error("Failed to delete lead."),
    });
  };

  const handleBulkAssign = async (userId: string) => {
    setIsBulkAssigning(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          assignLead.mutateAsync({ id, payload: { assignedTo: userId } }),
        ),
      );
      toast.success(`${selectedIds.length} lead(s) assigned.`);
      setRowSelection({});
    } catch {
      toast.error("Some leads could not be assigned.");
    } finally {
      setIsBulkAssigning(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => trashLead.mutateAsync(id)));
      toast.success(`${selectedIds.length} lead(s) moved to trash.`);
      setRowSelection({});
    } catch {
      toast.error("Some leads could not be deleted.");
    } finally {
      setIsBulkDeleting(false);
      setBulkDeleteOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <LeadsHeader />
      </div>

  <LeadsStats stats={data?.stats as any} isLoading={isLoading} />
      <div className="flex flex-col gap-4">
        <LeadsToolbar
          filters={filters}
          activeFilterCount={activeFilterCount}
          onSearchChange={setSearchTerm}
          onUpdateFilters={updateFilters}
          onExport={() => exportLeadsToCsv(leads)}
          onImport={() => setImportOpen(true)}
          onAddLead={handleAddLead}
        />

        <LeadsBulkActionsBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setRowSelection({})}
          onBulkAssign={handleBulkAssign}
          onBulkDelete={() => setBulkDeleteOpen(true)}
          isAssigning={isBulkAssigning}
          isDeleting={isBulkDeleting}
        />

        <LeadsTable
          leads={leads}
          onUpdateStatus={handleUpdateStatus}
          onUpdateContactStatus={handleUpdateContactStatus}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          hasActiveFilters={activeFilterCount > 0 || Boolean(filters.searchTerm)}
          sort={filters.sort ?? "-createdAt"}
          onSortChange={setSort}
          onClearFilters={resetFilters}
          onAddLead={handleAddLead}
          onRetry={() => refetch()}
          selection={rowSelection}
          onSelectionChange={setRowSelection}
          onOpenDetails={handleOpenDetails}
          onEdit={handleEdit}
          onAssign={handleAssign}
          onConvert={handleConvert}
          onDelete={handleDelete}
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
      </div>

      <LeadDetailsDrawer
        leadId={detailsLeadId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={handleEdit}
        onAssign={handleAssign}
        onConvert={handleConvert}
      />

      <LeadFormDialog
        mode={formMode}
        lead={editLead ?? undefined}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <LeadAssignDialog
        lead={assignLeadTarget}
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />

      <LeadConvertDialog
        lead={convertLeadTarget}
        open={convertOpen}
        onOpenChange={setConvertOpen}
      />

      <LeadImportDialog open={importOpen} onOpenChange={setImportOpen} />

      <LeadContactStatusDialog
        lead={contactStatusLead}
        open={contactStatusOpen}
        onOpenChange={setContactStatusOpen}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Move lead to trash?"
        description={`This will soft-delete ${
          deleteLeadTarget ? `${deleteLeadTarget.firstName} ${deleteLeadTarget.lastName}` : "this lead"
        }. You can restore it later from the trash.`}
        confirmText="Move to Trash"
        variant="destructive"
        isLoading={trashLead.isPending}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Move ${selectedIds.length} lead(s) to trash?`}
        description="Selected leads will be soft-deleted and can be restored later from the trash."
        confirmText="Move to Trash"
        variant="destructive"
        isLoading={isBulkDeleting}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
