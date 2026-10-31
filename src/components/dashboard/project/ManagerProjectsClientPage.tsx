"use client";

import { useCallback, useState } from "react";

import { useProjects, useProjectFilters } from "@/features/project/hooks";
import type { ProjectPermissions } from "@/features/project/utils/project.permission";
import type { IProject } from "@/types/project.types";
import { useClients } from "@/features/clients/hooks";
import type { IClient } from "@/types/clients";
import { ProjectsHeader } from "./project-header";
import { ProjectsStats } from "./ProjectStats";
import { ProjectsToolbar } from "./ProjectToolbar";
import { ProjectsTable } from "./ProjectTable";
import { ProjectsPagination } from "./ProjectPagination";
import { ProjectFormDialog } from "./ProjectFormDialog";
import { ProjectDetailsDialog } from "./ProjectDetailsDialog";


// Fixed manager permissions: no user lookup needed
const MANAGER_PERMISSIONS: ProjectPermissions = {
  canViewFinancials: false,
  canCreate: true,
  canEdit: true,
  canDelete: false,
};

export function ManagerProjectsPageClient() {
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
  } = useProjectFilters();

  const { data, isLoading, isError, error, refetch } = useProjects(queryFilters);

  const projects = data?.data ?? [];
  const meta = data?.meta;

  const { data: clientsResponse } = useClients({ limit: 200000 });
  const clients: IClient[] = clientsResponse?.data ?? [];

  // Row selection is not used for managers (no bulk delete), but the table expects it
  const [rowSelection, setRowSelection] = useState({});

  const [detailsProject, setDetailsProject] = useState<IProject | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editProject, setEditProject] = useState<IProject | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleOpenDetails = useCallback((project: IProject) => {
    setDetailsProject(project);
    setDetailsOpen(true);
  }, []);

  const handleEdit = useCallback((project: IProject) => {
    setFormMode("edit");
    setEditProject(project);
    setFormOpen(true);
  }, []);

  const handleAddProject = useCallback(() => {
    setFormMode("create");
    setEditProject(null);
    setFormOpen(true);
  }, []);

  // Managers cannot delete
  const handleDelete = useCallback(() => {}, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ProjectsHeader />
      </div>

      <ProjectsStats
        projectStat={data?.stats}
        isLoading={isLoading}
        showMoney={false}
      />

      <div className="flex flex-col gap-4">
        <ProjectsToolbar
          filters={filters}
          onSearchChange={setSearchTerm}
          onUpdateFilters={updateFilters}
          onAddProject={handleAddProject}
          clients={clients}
          canCreate={MANAGER_PERMISSIONS.canCreate}
          canViewFinancials={MANAGER_PERMISSIONS.canViewFinancials}
        />

        <ProjectsTable
          projects={projects}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          hasActiveFilters={activeFilterCount > 0 || Boolean(filters.searchTerm)}
          sort={filters.sort ?? "-createdAt"}
          onSortChange={setSort}
          onClearFilters={resetFilters}
          onAddProject={handleAddProject}
          onRetry={() => refetch()}
          selection={rowSelection}
          onSelectionChange={setRowSelection}
          onOpenDetails={handleOpenDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          permissions={MANAGER_PERMISSIONS}
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

      <ProjectFormDialog
        mode={formMode}
        project={editProject ?? undefined}
        open={formOpen}
        onOpenChange={setFormOpen}
        canViewFinancials={false}
      />

      <ProjectDetailsDialog
        project={detailsProject}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        role="MANAGER"
        onEdit={handleEdit}
      />
    </div>
  );
}