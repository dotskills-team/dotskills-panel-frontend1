
// "use client";

// import { useCallback, useMemo, useState } from "react";
// import type { RowSelectionState } from "@tanstack/react-table";
// import { toast } from "sonner";

// import { ConfirmDialog } from "@/components/shared/confirm-dialog";
// import { useProjects, useProjectFilters, useProjectMutations } from "@/features/project/hooks";

// import type { IProject } from "@/types/project.types";
// import { ProjectsHeader } from "./project-header";
// import { ProjectsStats } from "./ProjectStats";
// import { ProjectsToolbar } from "./ProjectToolbar";
// import { ProjectsBulkActionsBar } from "./ProjectBulkActionBar";
// import { ProjectsTable } from "./ProjectTable";
// import { ProjectsPagination } from "./ProjectPagination";
// import { ProjectFormDialog } from "./ProjectFormDialog";
// import { ProjectDetailsDialog } from "./ProjectDetailsDialog";
// import { useClients } from "@/features/clients/hooks";
// import { IClient } from "@/types/clients";
// import { useUser } from "@/context/UserContext";
// import { getProjectPermissions } from "@/features/project/utils/project.permission";
// import { useCurrentUser } from "../../../hooks/auth/useCurrentUser";

// export function ProjectsPageClient() {
//   const { data: user, isLoading: isUserLoading } = useCurrentUser();

//   const permissions = useMemo(
//     () => getProjectPermissions(user?.role),
//     [user?.role],
//   );


//   console.log("User ", user)
//   console.log("User Pending", isUserLoading)

// console.log("PROJECT ROLE DEBUG:", {
//   role: user?.role,
//   user: user,
//   permissions: permissions,
//   canViewFinancials: permissions.canViewFinancials,
// });
//   const {
//     filters,
//     queryFilters,
//     updateFilters,
//     setPage,
//     setLimit,
//     setSearchTerm,
//     setSort,
//     resetFilters,
//     activeFilterCount,
//   } = useProjectFilters();

//   const { data, isLoading, isError, error, refetch } = useProjects(queryFilters, {
//   enabled: !!user,
// });
//   const { trashProject } = useProjectMutations();

//   const projects = data?.data ?? [];
//   const meta = data?.meta;

//   const { data: clientsResponse } = useClients({ limit: 200000 });
//   const clients: IClient[] = clientsResponse?.data ?? [];

//   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
//   const selectedIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);

//   const [deleteTarget, setDeleteTarget] = useState<IProject | null>(null);
//   const [deleteOpen, setDeleteOpen] = useState(false);

//   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
//   const [isBulkDeleting, setIsBulkDeleting] = useState(false);

//   const [detailsProject, setDetailsProject] = useState<IProject | null>(null);
//   const [detailsOpen, setDetailsOpen] = useState(false);

//   const [formMode, setFormMode] = useState<"create" | "edit">("create");
//   const [editProject, setEditProject] = useState<IProject | null>(null);
//   const [formOpen, setFormOpen] = useState(false);

//   const handleOpenDetails = useCallback((project: IProject) => {
//     setDetailsProject(project);
//     setDetailsOpen(true);
//   }, []);

//   const handleEdit = useCallback(
//     (project: IProject) => {
//       if (!permissions.canEdit) return;
//       setFormMode("edit");
//       setEditProject(project);
//       setFormOpen(true);
//     },
//     [permissions.canEdit],
//   );

//   const handleAddProject = useCallback(() => {
//     if (!permissions.canCreate) return;
//     setFormMode("create");
//     setEditProject(null);
//     setFormOpen(true);
//   }, [permissions.canCreate]);

//   const handleDelete = useCallback(
//     (project: IProject) => {
//       if (!permissions.canDelete) return;
//       setDeleteTarget(project);
//       setDeleteOpen(true);
//     },
//     [permissions.canDelete],
//   );

//   const handleConfirmDelete = () => {
//     if (!deleteTarget) return;

//     trashProject.mutate(deleteTarget._id, {
//       onSuccess: () => {
//         toast.success("Project moved to trash.");
//         setDeleteOpen(false);
//       },
//       onError: () => toast.error("Failed to delete project."),
//     });
//   };

//   const handleBulkDelete = async () => {
//     setIsBulkDeleting(true);
//     try {
//       await Promise.all(selectedIds.map((id) => trashProject.mutateAsync(id)));
//       toast.success(`${selectedIds.length} project(s) moved to trash.`);
//       setRowSelection({});
//     } catch {
//       toast.error("Some projects could not be deleted.");
//     } finally {
//       setIsBulkDeleting(false);
//       setBulkDeleteOpen(false);
//     }
//   };
//   if (isUserLoading) {
//     return <h2>Loading...</h2>; 
//   }
//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//         <ProjectsHeader />
//       </div>

//       {/* <ProjectsStats
//         projectStat={data?.stats}
//         isLoading={isLoading}
//         showMoney={permissions.canViewFinancials}
//       /> */}

// <ProjectsStats
//   projectStat={data?.stats}
//   isLoading={isLoading || isUserLoading}
//   showMoney={permissions.canViewFinancials}
// />

//       <div className="flex flex-col gap-4">
//         <ProjectsToolbar
//           filters={filters}
//           onSearchChange={setSearchTerm}
//           onUpdateFilters={updateFilters}
//           onAddProject={handleAddProject}
//           clients={clients}
//           canCreate={permissions.canCreate}
//           canViewFinancials={permissions.canViewFinancials}
//         />

//         {permissions.canDelete && (
//           <ProjectsBulkActionsBar
//             selectedCount={selectedIds.length}
//             onClearSelection={() => setRowSelection({})}
//             onBulkDelete={() => setBulkDeleteOpen(true)}
//             isDeleting={isBulkDeleting}
//           />
//         )}

//         <ProjectsTable
//           projects={projects}
//           isLoading={isLoading}
//           isError={isError}
//           errorMessage={error?.message}
//           hasActiveFilters={activeFilterCount > 0 || Boolean(filters.searchTerm)}
//           sort={filters.sort ?? "-createdAt"}
//           onSortChange={setSort}
//           onClearFilters={resetFilters}
//           onAddProject={handleAddProject}
//           onRetry={() => refetch()}
//           selection={rowSelection}
//           onSelectionChange={setRowSelection}
//           onOpenDetails={handleOpenDetails}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           permissions={permissions}
//         />

//         {meta && projects.length > 0 && (
//           <ProjectsPagination
//             page={meta.page}
//             limit={meta.limit}
//             total={meta.total}
//             totalPage={meta.totalPage}
//             onPageChange={setPage}
//             onLimitChange={setLimit}
//           />
//         )}
//       </div>

//       {/* {(permissions.canCreate || permissions.canEdit) && (
//         <ProjectFormDialog
//           mode={formMode}
//           project={editProject ?? undefined}
//           open={formOpen}
//           onOpenChange={setFormOpen}
//         />
//       )} */}

//       {(permissions.canCreate || permissions.canEdit) && (
//         <ProjectFormDialog
//           mode={formMode}
//           project={editProject ?? undefined}
//           open={formOpen}
//           onOpenChange={setFormOpen}
//           canViewFinancials={permissions.canViewFinancials}
//         />
//       )}

//       <ProjectDetailsDialog
//         project={detailsProject}
//         open={detailsOpen}
//         onOpenChange={setDetailsOpen}
//         role={user?.role}
//         onEdit={permissions.canEdit ? handleEdit : undefined}
//       />

//       {permissions.canDelete && (
//         <>
//           <ConfirmDialog
//             open={deleteOpen}
//             onOpenChange={setDeleteOpen}
//             title="Move project to trash?"
//             description={`This will soft-delete ${deleteTarget ? deleteTarget.name : "this project"
//               }. You can restore it later from the trash.`}
//             confirmText="Move to Trash"
//             variant="destructive"
//             isLoading={trashProject.isPending}
//             onConfirm={handleConfirmDelete}
//           />

//           <ConfirmDialog
//             open={bulkDeleteOpen}
//             onOpenChange={setBulkDeleteOpen}
//             title={`Move ${selectedIds.length} project(s) to trash?`}
//             description="Selected projects will be soft-deleted and can be restored later from the trash."
//             confirmText="Move to Trash"
//             variant="destructive"
//             isLoading={isBulkDeleting}
//             onConfirm={handleBulkDelete}
//           />
//         </>
//       )}
//     </div>
//   );
// }



"use client";

import { useCallback, useMemo, useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useProjects, useProjectFilters, useProjectMutations } from "@/features/project/hooks";
import type { ProjectPermissions } from "@/features/project/utils/project.permission";

import type { IProject } from "@/types/project.types";
import { ProjectsHeader } from "./project-header";
import { ProjectsStats } from "./ProjectStats";
import { ProjectsToolbar } from "./ProjectToolbar";
import { ProjectsBulkActionsBar } from "./ProjectBulkActionBar";
import { ProjectsTable } from "./ProjectTable";
import { ProjectsPagination } from "./ProjectPagination";
import { ProjectFormDialog } from "./ProjectFormDialog";
import { ProjectDetailsDialog } from "./ProjectDetailsDialog";
import { useClients } from "@/features/clients/hooks";
import type { IClient } from "@/types/clients";

// Fixed admin / super admin permissions: no user lookup needed
const ADMIN_PERMISSIONS: ProjectPermissions = {
  canViewFinancials: true,
  canCreate: true,
  canEdit: true,
  canDelete: true,
};

export function ProjectsPageClient() {
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
  const { trashProject } = useProjectMutations();

  const projects = data?.data ?? [];
  const meta = data?.meta;

  const { data: clientsResponse } = useClients({ limit: 200000 });
  const clients: IClient[] = clientsResponse?.data ?? [];

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const selectedIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);

  const [deleteTarget, setDeleteTarget] = useState<IProject | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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

  const handleDelete = useCallback((project: IProject) => {
    setDeleteTarget(project);
    setDeleteOpen(true);
  }, []);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    trashProject.mutate(deleteTarget._id, {
      onSuccess: () => {
        toast.success("Project moved to trash.");
        setDeleteOpen(false);
      },
      onError: () => toast.error("Failed to delete project."),
    });
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => trashProject.mutateAsync(id)));
      toast.success(`${selectedIds.length} project(s) moved to trash.`);
      setRowSelection({});
    } catch {
      toast.error("Some projects could not be deleted.");
    } finally {
      setIsBulkDeleting(false);
      setBulkDeleteOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ProjectsHeader />
      </div>

      <ProjectsStats
        projectStat={data?.stats}
        isLoading={isLoading}
        showMoney={ADMIN_PERMISSIONS.canViewFinancials}
      />

      <div className="flex flex-col gap-4">
        <ProjectsToolbar
          filters={filters}
          onSearchChange={setSearchTerm}
          onUpdateFilters={updateFilters}
          onAddProject={handleAddProject}
          clients={clients}
          canCreate={ADMIN_PERMISSIONS.canCreate}
          canViewFinancials={ADMIN_PERMISSIONS.canViewFinancials}
        />

        <ProjectsBulkActionsBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setRowSelection({})}
          onBulkDelete={() => setBulkDeleteOpen(true)}
          isDeleting={isBulkDeleting}
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
          permissions={ADMIN_PERMISSIONS}
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
        canViewFinancials={ADMIN_PERMISSIONS.canViewFinancials}
      />

      <ProjectDetailsDialog
        project={detailsProject}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        role="ADMIN"
        onEdit={handleEdit}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Move project to trash?"
        description={`This will soft-delete ${deleteTarget ? deleteTarget.name : "this project"}. You can restore it later from the trash.`}
        confirmText="Move to Trash"
        variant="destructive"
        isLoading={trashProject.isPending}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Move ${selectedIds.length} project(s) to trash?`}
        description="Selected projects will be soft-deleted and can be restored later from the trash."
        confirmText="Move to Trash"
        variant="destructive"
        isLoading={isBulkDeleting}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}