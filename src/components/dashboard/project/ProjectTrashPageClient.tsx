
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RowSelectionState } from "@tanstack/react-table";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { IProject } from "@/types/project.types";
import { useDeletedProjects, useProjectFilters, useProjectMutations } from "@/features/project/hooks";
import { ProjectsTrashBulkActionsBar } from "./ProjectTrashBulkActionbar";
import { ProjectsTrashTable } from "./ProjectTrashTable";
import { ProjectsPagination } from "./ProjectPagination";
import { useUser } from "@/context/UserContext";

export function ProjectsTrashPageClient() {
  const { filters, queryFilters, setSearchTerm, setPage, setLimit, activeFilterCount } =
    useProjectFilters();

  const { user } = useUser();
  // Must match the backend (project.service.ts → permanentlyDeleteProject)
  const canPermanentDelete =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const { data, isLoading, isError, error, refetch } = useDeletedProjects(queryFilters);
  const { restoreProject, permanentDeleteProject } = useProjectMutations();
  const projects = data?.data ?? [];
  const meta = data?.meta;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const selectedIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);

  const [restoreTarget, setRestoreTarget] = useState<IProject | null>(null);
  const [restoreOpen, setRestoreOpen] = useState(false);

  const [bulkRestoreOpen, setBulkRestoreOpen] = useState(false);
  const [isBulkRestoring, setIsBulkRestoring] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<IProject | null>(null);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [search, setSearch] = useState(filters.searchTerm ?? "");

  const handleRestore = (project: IProject) => {
    setRestoreTarget(project);
    setRestoreOpen(true);
  };

  const handleConfirmRestore = () => {
    if (!restoreTarget) return;

    restoreProject.mutate(restoreTarget._id, {
      onSuccess: () => {
        toast.success("Project restored successfully.");
        setRestoreOpen(false);
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Failed to restore project."),
    });
  };

  const handleBulkRestore = async () => {
    setIsBulkRestoring(true);
    try {
      await Promise.all(selectedIds.map((id) => restoreProject.mutateAsync(id)));
      toast.success(`${selectedIds.length} project(s) restored.`);
      setRowSelection({});
    } catch {
      toast.error("Some projects could not be restored.");
    } finally {
      setIsBulkRestoring(false);
      setBulkRestoreOpen(false);
    }
  };

  const confirmPermanentDelete = async () => {
    if (!deleteTarget) return;

    try {
      await permanentDeleteProject.mutateAsync(deleteTarget._id);
      toast.success("Project permanently deleted.");

      setRowSelection((prev) => {
        const { [deleteTarget._id]: _removed, ...rest } = prev;
        return rest;
      });
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to delete project.");
    }
  };

  // Sequential on purpose: each backend delete re-shifts the priority order of
  // the remaining projects, so parallel deletes could race on priorities.
  const handleBulkPermanentDelete = async () => {
    setIsBulkDeleting(true);
    const failedIds: string[] = [];

    for (const id of selectedIds) {
      try {
        await permanentDeleteProject.mutateAsync(id);
      } catch {
        failedIds.push(id);
      }
    }

    const deletedCount = selectedIds.length - failedIds.length;
    if (deletedCount > 0) toast.success(`${deletedCount} project(s) permanently deleted.`);
    if (failedIds.length > 0) toast.error(`${failedIds.length} project(s) could not be deleted.`);

    // Keep only the failed ones selected so the user can retry them
    setRowSelection(Object.fromEntries(failedIds.map((id) => [id, true])));
    setIsBulkDeleting(false);
    setBulkDeleteOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Button variant="ghost" size="sm" className="w-fit gap-2 text-muted-foreground" asChild>
          <Link href="/dashboard/project">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Project Trash</h1>
          <p className="text-sm text-muted-foreground">
            Restore projects that were moved to trash
            {canPermanentDelete ? ", or delete them permanently." : "."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            placeholder="Search trashed projects..."
            className="pl-9"
            onChange={(event) => {
              setSearch(event.target.value);
              setSearchTerm(event.target.value);
            }}
          />
        </div>

        <ProjectsTrashBulkActionsBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setRowSelection({})}
          onBulkRestore={() => setBulkRestoreOpen(true)}
          isRestoring={isBulkRestoring}
          onBulkPermanentDelete={
            canPermanentDelete ? () => setBulkDeleteOpen(true) : undefined
          }
          isDeleting={isBulkDeleting}
        />

        <ProjectsTrashTable
          projects={projects}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          hasActiveFilters={activeFilterCount > 0 || Boolean(filters.searchTerm)}
          onRetry={() => refetch()}
          selection={rowSelection}
          onSelectionChange={setRowSelection}
          onRestore={handleRestore}
          onPermanentDelete={setDeleteTarget}
          canPermanentDelete={canPermanentDelete}
        />

        {meta && projects.length > 0 && (
          <ProjectsPagination
            page={meta.page}
            limit={meta.limit}
            total={meta.total}
            totalPage={meta.totalPage}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </div>

      <ConfirmDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        title="Restore project?"
        description={`This will restore ${
          restoreTarget ? restoreTarget.name : "this project"
        } and move it back to the active projects list.`}
        confirmText="Restore"
        isLoading={restoreProject.isPending}
        onConfirm={handleConfirmRestore}
      />

      <ConfirmDialog
        open={bulkRestoreOpen}
        onOpenChange={setBulkRestoreOpen}
        title={`Restore ${selectedIds.length} project(s)?`}
        description="Selected projects will be restored and moved back to the active projects list."
        confirmText="Restore"
        isLoading={isBulkRestoring}
        onConfirm={handleBulkRestore}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete permanently?"
        description={`"${deleteTarget?.name ?? ""}" will be deleted forever. This cannot be undone.`}
        confirmText="Delete permanently"
        variant="destructive"
        isLoading={permanentDeleteProject.isPending}
        onConfirm={confirmPermanentDelete}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Permanently delete ${selectedIds.length} project(s)?`}
        description="The selected projects will be deleted forever. This cannot be undone."
        confirmText="Delete permanently"
        variant="destructive"
        isLoading={isBulkDeleting}
        onConfirm={handleBulkPermanentDelete}
      />
    </div>
  );
}