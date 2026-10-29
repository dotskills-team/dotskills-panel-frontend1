// "use client";

// import { useState, useCallback, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Plus, LayoutGrid, Table } from "lucide-react";
// import type { User } from "@/types/user.types";
// import type { UserStatsData } from "@/components/dashboard/users/cards/user-stats-cards";
// import {
//   useUsers,
//   useUserFilters,
//   useCreateUser,
//   useUpdateUser,
//   useDeleteUser,
//   useUpdateUserStatus,
// } from "@/features/users/hooks";
// import { UserFilters } from "@/components/dashboard/users/filters/user-filters";
// import { UsersTable } from "@/components/dashboard/users/table/users-table";
// import { UserStatsCards } from "@/components/dashboard/users/cards/user-stats-cards";
// import { getUserTableColumns } from "@/components/dashboard/users/table/user-table-columns";
// import { UserGridView } from "@/components/dashboard/users/grid/user-grid-view";
// import { UserDetailsSheet } from "@/components/dashboard/users/user-details-sheet";
// import {
//   CreateUserDialog,
//   UpdateUserDialog,
//   DeleteUserDialog,
//   StatusChangeDialog,
// } from "@/components/dashboard/users/dialogs/user-dialogs";
// import type {
//   CreateUserInput,
//   UpdateUserInput,
// } from "@/features/users/schemas/user.schema";
// import { UsersToolbar } from "./usertoolbar";

// export function UsersPageClient() {
//   const [view, setView] = useState<"table" | "grid">("table");
//   const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | undefined>();
//   const [dialogState, setDialogState] = useState({
//     createOpen: false,
//     updateOpen: false,
//     deleteOpen: false,
//     statusOpen: false,
//     detailsOpen: false,
//   });

//   const { filters, getQueryParams, ...filterMethods } = useUserFilters();
//   const queryParams = getQueryParams();

//   const { data: response, isLoading } = useUsers(queryParams);
//   const users = response?.data || [];
//   const stats = response?.stats as UserStatsData | undefined;

//   const createUserMutation = useCreateUser();
//   const updateUserMutation = useUpdateUser(selectedUser?._id || "");
//   const deleteUserMutation = useDeleteUser();
//   const updateStatusMutation = useUpdateUserStatus();

//   const pageCount = response?.meta?.totalPage || 1;

//   const handleViewDetails = useCallback((user: User) => {
//     setSelectedUser(user);
//     setDialogState((p) => ({ ...p, detailsOpen: true }));
//   }, []);

//   const handleEdit = useCallback((user: User) => {
//     setSelectedUser(user);
//     setDialogState((p) => ({ ...p, updateOpen: true, detailsOpen: false }));
//   }, []);

//   const handleDeleteRequest = useCallback((user: User) => {
//     setSelectedUser(user);
//     setDialogState((p) => ({ ...p, deleteOpen: true, detailsOpen: false }));
//   }, []);

//   const handleStatusRequest = useCallback((user: User) => {
//     setSelectedUser(user);
//     setDialogState((p) => ({ ...p, statusOpen: true, detailsOpen: false }));
//   }, []);

//   const columns = useMemo(
//     () =>
//       getUserTableColumns({
//         onEdit: handleEdit,
//         onDelete: handleDeleteRequest,
//         onViewDetails: handleViewDetails,
//         onStatusChange: handleStatusRequest,
//       }),
//     [handleEdit, handleDeleteRequest, handleViewDetails, handleStatusRequest],
//   );

//   const handleCreateUser = useCallback(
//     async (data: CreateUserInput) => {
//       await createUserMutation.mutateAsync(data);
//     },
//     [createUserMutation],
//   );

//   const handleUpdateUser = useCallback(
//     async (data: UpdateUserInput) => {
//       if (selectedUser) {
//         await updateUserMutation.mutateAsync({
//           ...data,
//           avatar: data.avatar ?? undefined,
//         });
//       }
//     },
//     [selectedUser, updateUserMutation],
//   );

//   const handleDeleteUser = useCallback(async () => {
//     if (selectedUser) {
//       await deleteUserMutation.mutateAsync(selectedUser._id);
//     }
//   }, [selectedUser, deleteUserMutation]);

//   const handleStatusChange = useCallback(
//     async (status: "ACTIVE" | "INACTIVE" | "SUSPENDED") => {
//       if (selectedUser) {
//         await updateStatusMutation.mutateAsync({
//           userId: selectedUser._id,
//           payload: { status },
//         });
//       }
//     },
//     [selectedUser, updateStatusMutation],
//   );

//   return (
//     <div className="bg-gray-100 dark:bg-slate-950 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight text-foreground">
//             Team Members
//           </h1>
//           <p className="mt-1 text-sm text-(--muted-fg)">
//             Manage who has access to DotSkills Panel and what they can do.
//           </p>
//         </div>
//         <Button
//           onClick={() => setDialogState((p) => ({ ...p, createOpen: true }))}
//           className="gap-2 duration-500 hover:cursor-pointer hover:scale-105 transition-transform transform ease-in-out hover:bg-cyan-800 text-white bg-indigo-600"
//         >
//           <Plus className="h-4 w-4" />
//           Add user
//         </Button>
//       </div>

//       <UserStatsCards stats={stats} isLoading={isLoading} />

//       {/* <UserFilters
//         filters={filters}
//         onSearch={filterMethods.setSearch}
//         onRoleChange={filterMethods.setRole}
//         onStatusChange={filterMethods.setStatus}
//         onDepartmentChange={filterMethods.setDepartment}
//         onDesignationChange={filterMethods.setDesignation}
//         onClear={filterMethods.clearFilters}
//       /> */}
      
//       <UsersToolbar
//         filters={filters}
//         onSearch={filterMethods.setSearch}
//         onRoleChange={filterMethods.setRole}
//         onStatusChange={filterMethods.setStatus}
//         onDepartmentChange={filterMethods.setDepartment}
//         onDesignationChange={filterMethods.setDesignation}
//         onClear={filterMethods.clearFilters}
//       />

//       <Tabs value={view} onValueChange={(value) => setView(value as "table" | "grid")}>
//         <TabsList className="grid w-full max-w-xs grid-cols-2">
//           <TabsTrigger value="table" className="gap-2">
//             <Table className="h-4 w-4" />
//             Table
//           </TabsTrigger>
//           <TabsTrigger value="grid" className="gap-2">
//             <LayoutGrid className="h-4 w-4" />
//             Grid
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="table" className="space-y-4">
//           <UsersTable
//             data={users}
//             columns={columns}
//             isLoading={isLoading}
//             pageCount={pageCount}
//             currentPage={filters.page}
//             onPageChange={filterMethods.setPage}
//             pageSize={filters.limit}
//             onSelectionChange={setSelectedUsers}
//           />
//         </TabsContent>

//         <TabsContent value="grid" className="space-y-4">
//           <UserGridView
//             users={users}
//             isLoading={isLoading}
//             onEdit={handleEdit}
//             onDelete={handleDeleteRequest}
//             onStatusChange={handleStatusRequest}
//             onViewDetails={handleViewDetails}
//           />
//         </TabsContent>
//       </Tabs>

//       <UserDetailsSheet
//         user={selectedUser}
//         open={dialogState.detailsOpen}
//         onOpenChange={(open) => setDialogState((p) => ({ ...p, detailsOpen: open }))}
//         onEdit={handleEdit}
//         onDelete={handleDeleteRequest}
//         onStatusChange={handleStatusRequest}
//       />

//       <CreateUserDialog
//         open={dialogState.createOpen}
//         onOpenChange={(open) => setDialogState((p) => ({ ...p, createOpen: open }))}
//         onSubmit={handleCreateUser}
//         isLoading={createUserMutation.isPending}
//       />

//       <UpdateUserDialog
//         open={dialogState.updateOpen}
//         onOpenChange={(open) => setDialogState((p) => ({ ...p, updateOpen: open }))}
//         user={selectedUser}
//         onSubmit={handleUpdateUser}
//         isLoading={updateUserMutation.isPending}
//       />

//       <DeleteUserDialog
//         open={dialogState.deleteOpen}
//         onOpenChange={(open) => setDialogState((p) => ({ ...p, deleteOpen: open }))}
//         user={selectedUser}
//         onConfirm={handleDeleteUser}
//         isLoading={deleteUserMutation.isPending}
//       />

//       <StatusChangeDialog
//         open={dialogState.statusOpen}
//         onOpenChange={(open) => setDialogState((p) => ({ ...p, statusOpen: open }))}
//         user={selectedUser}
//         currentStatus={selectedUser?.status}
//         onStatusChange={handleStatusChange}
//         isLoading={updateStatusMutation.isPending}
//       />
//     </div>
//   );
// }





"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, Table } from "lucide-react";
import type { User } from "@/types/user.types";
import type { UserStatsData } from "@/components/dashboard/users/cards/user-stats-cards";
import {
  useUsers,
  useUserFilters,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUpdateUserStatus
} from "@/features/users/hooks";
import { UsersTable } from "@/components/dashboard/users/table/users-table";
import { UserStatsCards } from "@/components/dashboard/users/cards/user-stats-cards";
import { getUserTableColumns } from "@/components/dashboard/users/table/user-table-columns";
import { UserGridView } from "@/components/dashboard/users/grid/user-grid-view";
import { UserDetailsSheet } from "@/components/dashboard/users/user-details-sheet";
import {
  CreateUserDialog,
  UpdateUserDialog,
  DeleteUserDialog,
  StatusChangeDialog,
} from "@/components/dashboard/users/dialogs/user-dialogs";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/features/users/schemas/user.schema";
import { UsersToolbar } from "./usertoolbar";
// TODO: replace with your real hook that returns the logged-in user
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useAdminChangePassword } from "@/features/users/hooks/se-admin-change-password";

export function UsersPageClient() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [, setSelectedUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [dialogState, setDialogState] = useState({
    createOpen: false,
    updateOpen: false,
    deleteOpen: false,
    statusOpen: false,
    detailsOpen: false,
  });

  const { filters, getQueryParams, ...filterMethods } = useUserFilters();
  const queryParams = getQueryParams();

  const { data: response, isLoading } = useUsers(queryParams);
  const users = response?.data || [];
  const stats = response?.stats as UserStatsData | undefined;

const { data: currentUser } = useCurrentUser();

const canChangePassword =
  currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser(selectedUser?._id || "");
  const deleteUserMutation = useDeleteUser();
  const updateStatusMutation = useUpdateUserStatus();
  const adminChangePasswordMutation = useAdminChangePassword();

  const pageCount = response?.meta?.totalPage || 1;

  const handleViewDetails = useCallback((user: User) => {
    setSelectedUser(user);
    setDialogState((p) => ({ ...p, detailsOpen: true }));
  }, []);

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setDialogState((p) => ({ ...p, updateOpen: true, detailsOpen: false }));
  }, []);

  const handleDeleteRequest = useCallback((user: User) => {
    setSelectedUser(user);
    setDialogState((p) => ({ ...p, deleteOpen: true, detailsOpen: false }));
  }, []);

  const handleStatusRequest = useCallback((user: User) => {
    setSelectedUser(user);
    setDialogState((p) => ({ ...p, statusOpen: true, detailsOpen: false }));
  }, []);

  const columns = useMemo(
    () =>
      getUserTableColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteRequest,
        onViewDetails: handleViewDetails,
        onStatusChange: handleStatusRequest,
      }),
    [handleEdit, handleDeleteRequest, handleViewDetails, handleStatusRequest],
  );

  const handleCreateUser = useCallback(
    async (data: CreateUserInput) => {
      await createUserMutation.mutateAsync(data);
    },
    [createUserMutation],
  );

  const handleUpdateUser = useCallback(
    async (data: UpdateUserInput) => {
      if (selectedUser) {
        await updateUserMutation.mutateAsync({
          ...data,
          avatar: data.avatar ?? undefined,
        });
      }
    },
    [selectedUser, updateUserMutation],
  );

  const handleChangePassword = useCallback(
    async (userId: string, newPassword: string) => {
      await adminChangePasswordMutation.mutateAsync({ userId, newPassword });
    },
    [adminChangePasswordMutation],
  );

  const handleDeleteUser = useCallback(async () => {
    if (selectedUser) {
      await deleteUserMutation.mutateAsync(selectedUser._id);
    }
  }, [selectedUser, deleteUserMutation]);

  const handleStatusChange = useCallback(
    async (status: "ACTIVE" | "INACTIVE" | "SUSPENDED") => {
      if (selectedUser) {
        await updateStatusMutation.mutateAsync({
          userId: selectedUser._id,
          payload: { status },
        });
      }
    },
    [selectedUser, updateStatusMutation],
  );

  return (
    <div className="bg-gray-100 dark:bg-slate-950 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Team Members
          </h1>
          <p className="mt-1 text-sm text-(--muted-fg)">
            Manage who has access to DotSkills Panel and what they can do.
          </p>
        </div>
        <Button
          onClick={() => setDialogState((p) => ({ ...p, createOpen: true }))}
          className="gap-2 duration-500 hover:cursor-pointer hover:scale-105 transition-transform transform ease-in-out hover:bg-cyan-800 text-white bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          Add user
        </Button>
      </div>

      <UserStatsCards stats={stats} isLoading={isLoading} />

      <UsersToolbar
        filters={filters}
        onSearch={filterMethods.setSearch}
        onRoleChange={filterMethods.setRole}
        onStatusChange={filterMethods.setStatus}
        onDepartmentChange={filterMethods.setDepartment}
        onDesignationChange={filterMethods.setDesignation}
        onClear={filterMethods.clearFilters}
      />

      <Tabs
        value={view}
        onValueChange={(value) => setView(value as "table" | "grid")}
      >
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="table" className="gap-2">
            <Table className="h-4 w-4" />
            Table
          </TabsTrigger>
          <TabsTrigger value="grid" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Grid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <UsersTable
            data={users}
            columns={columns}
            isLoading={isLoading}
            pageCount={pageCount}
            currentPage={filters.page}
            onPageChange={filterMethods.setPage}
            pageSize={filters.limit}
            onSelectionChange={setSelectedUsers}
          />
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <UserGridView
            users={users}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            onStatusChange={handleStatusRequest}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
      </Tabs>

      <UserDetailsSheet
        user={selectedUser}
        open={dialogState.detailsOpen}
        onOpenChange={(open) =>
          setDialogState((p) => ({ ...p, detailsOpen: open }))
        }
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onStatusChange={handleStatusRequest}
      />

      <CreateUserDialog
        open={dialogState.createOpen}
        onOpenChange={(open) =>
          setDialogState((p) => ({ ...p, createOpen: open }))
        }
        onSubmit={handleCreateUser}
        isLoading={createUserMutation.isPending}
      />

      <UpdateUserDialog
        open={dialogState.updateOpen}
        onOpenChange={(open) =>
          setDialogState((p) => ({ ...p, updateOpen: open }))
        }
        user={selectedUser}
        onSubmit={handleUpdateUser}
        isLoading={updateUserMutation.isPending}
        canChangePassword={canChangePassword}
        onChangePassword={handleChangePassword}
      />

      <DeleteUserDialog
        open={dialogState.deleteOpen}
        onOpenChange={(open) =>
          setDialogState((p) => ({ ...p, deleteOpen: open }))
        }
        user={selectedUser}
        onConfirm={handleDeleteUser}
        isLoading={deleteUserMutation.isPending}
      />

      <StatusChangeDialog
        open={dialogState.statusOpen}
        onOpenChange={(open) =>
          setDialogState((p) => ({ ...p, statusOpen: open }))
        }
        user={selectedUser}
        currentStatus={selectedUser?.status}
        onStatusChange={handleStatusChange}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}