
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useClients, useClientMutations } from "@/features/clients/hooks";
import type { ClientFilters, IClient } from "@/types/clients";
import type { CreateClientValues } from "@/features/clients/schemas/client.schema";
import type { AssignClientManagerValues } from "@/features/clients/schemas/client.schema";
import type { AddClientNoteValues } from "@/features/clients/schemas/client.schema";
import type { AddClientDocumentValues } from "@/features/clients/schemas/client.schema";

import { ClientsStats } from "./clients-stats";
import { ClientsTable } from "./clients-table";
import { ClientFormDialog } from "./client-form-dialog";
import { ClientAssignDialog } from "./client-assign-dialog";
import { ClientNoteDialog } from "./client-note-dialog";
import { ClientDocumentDialog } from "./client-document-dialog";
import { ClientDetailsSheet } from "./client-details-sheet";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Download, Trash2 } from "lucide-react";
import { CLIENT_STATUS_OPTIONS } from "@/features/clients/constants/client.constant";
import { exportClients } from "@/features/clients/utils/export.utils";
import { getClientFullName } from "@/features/clients/utils/client.utils";
import { useUsers } from "@/features/users/hooks";
import { ProjectsPagination } from "../project/ProjectPagination";

const ALL_STATUS = "ALL" as const;

type StatusFilter = NonNullable<ClientFilters["status"]> | typeof ALL_STATUS;

export function ClientsPageClient() {
  // Pagination + filters (server-side)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>(ALL_STATUS);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
    ...(filterStatus !== ALL_STATUS ? { status: filterStatus } : {}),
  };

  const { data: clientsResponse, isLoading } = useClients(filters);
  const clients: IClient[] = clientsResponse?.data ?? [];
  const meta = clientsResponse?.meta;

  // If the last item on the last page was removed, step back a page
  useEffect(() => {
    if (meta && meta.totalPage > 0 && page > meta.totalPage) {
      setPage(meta.totalPage);
    }
  }, [meta, page]);

  const mutations = useClientMutations();
  const { data: usersResponse } = useUsers();
  const managers =
    usersResponse?.data?.filter((user) => user.role === "MANAGER") ?? [];

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);

  // Soft-delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<IClient | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected client
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  // Handlers
  const handleStatusChange = (value: string) => {
    setFilterStatus(value as StatusFilter);
    setPage(1);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  const handleCreateClient = async (data: CreateClientValues) => {
    try {
      await mutations.createClient.mutateAsync(data);
      toast.success("Client created successfully");
      setFormDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create client");
      console.error(error);
    }
  };

  const handleEditClient = async (data: CreateClientValues) => {
    if (!selectedClient) return;
    try {
      await mutations.updateClient.mutateAsync({
        id: selectedClient._id,
        payload: data,
      });
      toast.success("Client updated successfully");
      setFormDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      toast.error("Failed to update client");
      console.error(error);
    }
  };

  const handleAssignManager = async (data: AssignClientManagerValues) => {
    if (!selectedClient) return;
    try {
      await mutations.assignManager.mutateAsync({
        id: selectedClient._id,
        payload: data,
      });
      toast.success("Manager assigned successfully");
      setAssignDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      toast.error("Failed to assign manager");
      console.error(error);
    }
  };

  const handleAddNote = async (data: AddClientNoteValues) => {
    if (!selectedClient) return;
    try {
      await mutations.addNote.mutateAsync({
        id: selectedClient._id,
        payload: data,
      });
      toast.success("Note added successfully");
      setNoteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add note");
      console.error(error);
    }
  };

  const handleUploadDocument = async (data: AddClientDocumentValues) => {
    if (!selectedClient) return;
    try {
      await mutations.addDocument.mutateAsync({
        id: selectedClient._id,
        payload: data,
      });
      toast.success("Document uploaded successfully");
      setDocumentDialogOpen(false);
    } catch (error) {
      toast.error("Failed to upload document");
      console.error(error);
    }
  };

  const handleRequestDelete = (client: IClient) => {
    setDeleteTarget(client);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await mutations.trashClient.mutateAsync(deleteTarget._id);
      toast.success(`${getClientFullName(deleteTarget)} moved to trash.`);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Failed to delete client");
      console.error(error);
    }
  };

  const handleExport = () => {
    try {
      exportClients(clients);
      toast.success("Clients exported successfully");
    } catch (error) {
      toast.error("Failed to export clients");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center md:flex-row flex-col gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Manage all your clients in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-2 hover:cursor-pointer hover:scale-105 transition-transform duration-500 transform ease-in-out hover:bg-rose-800 text-white bg-red-600"
            asChild
          >
            <Link href="/dashboard/clients/trash">
              <Trash2 className="h-4 w-4" />
              Trash
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedClient(null);
              setFormDialogOpen(true);
            }}
            className="gap-2 duration-500 hover:cursor-pointer hover:scale-105 transition-transform transform ease-in-out hover:bg-cyan-800 text-white bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <ClientsStats />

      {/* Filters & Search */}
      <Card className="rounded-lg border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Search by name, email, phone, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUS}>All Status</SelectItem>
                {CLIENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <ClientsTable
        clients={clients}
        isLoading={isLoading}
        onView={(client) => {
          setSelectedClient(client);
          setDetailsSheetOpen(true);
        }}
        onEdit={(client) => {
          setSelectedClient(client);
          setFormDialogOpen(true);
        }}
        onAssignManager={(client) => {
          setSelectedClient(client);
          setAssignDialogOpen(true);
        }}
        onAddNote={(client) => {
          setSelectedClient(client);
          setNoteDialogOpen(true);
        }}
        onUploadDocument={(client) => {
          setSelectedClient(client);
          setDocumentDialogOpen(true);
        }}
        onDelete={handleRequestDelete}
      />

      {/* Pagination */}
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

      {/* Dialogs */}
      <ClientFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        client={selectedClient ?? undefined}
        onSubmit={selectedClient ? handleEditClient : handleCreateClient}
        isSubmitting={
          mutations.createClient.isPending || mutations.updateClient.isPending
        }
      />

      <ClientAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        managers={managers}
        onSubmit={handleAssignManager}
        isSubmitting={mutations.assignManager.isPending}
        currentManager={selectedClient?.accountManager?._id}
      />

      <ClientNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        onSubmit={handleAddNote}
        isSubmitting={mutations.addNote.isPending}
      />

      <ClientDocumentDialog
        open={documentDialogOpen}
        onOpenChange={setDocumentDialogOpen}
        onSubmit={handleUploadDocument}
        isSubmitting={mutations.addDocument.isPending}
      />

      {/* Soft-delete confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Move client to trash?"
        description={`This will soft-delete ${
          deleteTarget ? getClientFullName(deleteTarget) : "this client"
        }. You can restore them later from the trash.`}
        confirmText="Move to Trash"
        variant="destructive"
        isLoading={mutations.trashClient.isPending}
        onConfirm={handleConfirmDelete}
      />

      {/* Details Sheet */}
      {selectedClient && (
        <ClientDetailsSheet
          client={selectedClient}
          open={detailsSheetOpen}
          onOpenChange={setDetailsSheetOpen}
        />
      )}
    </div>
  );
}