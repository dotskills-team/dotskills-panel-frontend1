"use client";

import { useState } from "react";
import { Globe, Server } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useAuthStore } from "@/stores/auth.store";
import {
  CREDENTIAL_ROLES,
  WRITE_ROLES,
} from "@/features/domain-hosting/constants/domain-hosting.constant";
import {
  useDeleteTarget,
  useDomainHostingList,
  useProjectOptions,
} from "@/features/domain-hosting/hooks/use-domain-hosting";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type {
  DomainRecord,
  HostingRecord,
  TargetRecord,
  TargetType,
} from "@/types/domain-hosting.types";

import { DomainFormDialog } from "./domain-form-dialog";
import { DomainHostingTable } from "./domain-hosting-table";
import { HostingFormDialog } from "./hosting-form-dialog";
import { LogContactDialog } from "./log-contact-dialog";
import { OverviewTab } from "./overview-tab";
import { RecordDetailSheet } from "./record-detail-sheet";
import { RenewDialog } from "./renew-dialog";

type TabValue = "overview" | "domains" | "hosting";

interface FormState {
  open: boolean;
  type: TargetType;
  record: TargetRecord | null;
}

interface ActionTarget {
  type: TargetType;
  record: TargetRecord;
}

const recordName = (type: TargetType, record: TargetRecord) =>
  type === "domain"
    ? (record as DomainRecord).domainName
    : (record as HostingRecord).provider || "Hosting";

export function DomainHostingPageClient() {
  const role = useAuthStore((state) => state.user?.role);
  const canWrite = WRITE_ROLES.includes(role ?? "");
  const canSeeCredentials = CREDENTIAL_ROLES.includes(role ?? "");

  const [activeTab, setActiveTab] = useState<TabValue>("overview");

  const [formState, setFormState] = useState<FormState>({ open: false, type: "domain", record: null });
  const [renewTarget, setRenewTarget] = useState<ActionTarget | null>(null);
  const [logTarget, setLogTarget] = useState<ActionTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActionTarget | null>(null);
  const [viewTarget, setViewTarget] = useState<{ type: TargetType; id: string } | null>(null);

  // Only users who can write need the project and domain lists (for the forms).
  // Developers get only their assigned projects.
  const projectsQuery = useProjectOptions(canWrite, role);
  const domainOptionsQuery = useDomainHostingList(
    "domain",
    { page: 1, limit: 200 },
  );
  const deleteMutation = useDeleteTarget();

  const openForm = (type: TargetType, record: TargetRecord | null = null) =>
    setFormState({ open: true, type, record });

  const closeForm = (open: boolean) => setFormState((prev) => ({ ...prev, open }));

  /** Opening an action from the detail sheet closes the sheet first. */
  const fromSheet = (action: () => void) => {
    setViewTarget(null);
    action();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync({ type: deleteTarget.type, id: deleteTarget.record._id });
      toast.success(`${recordName(deleteTarget.type, deleteTarget.record)} deleted.`);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete the record."));
    }
  };

  const tableHandlers = (type: TargetType) => ({
    canWrite,
    onView: (record: TargetRecord) => setViewTarget({ type, id: record._id }),
    onEdit: (record: TargetRecord) => openForm(type, record),
    onRenew: (record: TargetRecord) => setRenewTarget({ type, record }),
    onLogContact: (record: TargetRecord) => setLogTarget({ type, record }),
    onDelete: (record: TargetRecord) => setDeleteTarget({ type, record }),
  });

  return (
    <div className="space-y-6">
      {/* -------------------------------- Header -------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Domain & Hosting</h1>
          <p className="text-sm text-muted-foreground">
            Track client domains and hosting, and contact clients before they expire.
          </p>
        </div>

        {canWrite && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => openForm("hosting")}>
              <Server className="h-4 w-4" />
              Add hosting
            </Button>
            <Button onClick={() => openForm("domain")}>
              <Globe className="h-4 w-4" />
              Add domain
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="hosting">Hosting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab
            canWrite={canWrite}
            onView={(type, record) => setViewTarget({ type, id: record._id })}
            onRenew={(type, record) => setRenewTarget({ type, record })}
            onLogContact={(type, record) => setLogTarget({ type, record })}
            onOpenReminder={(type, id) => setViewTarget({ type, id })}
          />
        </TabsContent>

        <TabsContent value="domains" className="mt-6">
          <DomainHostingTable type="domain" {...tableHandlers("domain")} />
        </TabsContent>

        <TabsContent value="hosting" className="mt-6">
          <DomainHostingTable type="hosting" {...tableHandlers("hosting")} />
        </TabsContent>
      </Tabs>

      {/* ------------------------------- Dialogs / sheets --------------------------- */}
      {canWrite && formState.type === "domain" && (
        <DomainFormDialog
          open={formState.open}
          onOpenChange={closeForm}
          record={formState.record as DomainRecord | null}
          projects={projectsQuery.data ?? []}
          projectsLoading={projectsQuery.isLoading}
        />
      )}

      {canWrite && formState.type === "hosting" && (
        <HostingFormDialog
          open={formState.open}
          onOpenChange={closeForm}
          record={formState.record as HostingRecord | null}
          projects={projectsQuery.data ?? []}
          projectsLoading={projectsQuery.isLoading}
          domainOptions={(domainOptionsQuery.data?.data ?? []) as DomainRecord[]}
        />
      )}

      {renewTarget && (
        <RenewDialog
          open
          onOpenChange={(open) => !open && setRenewTarget(null)}
          type={renewTarget.type}
          recordId={renewTarget.record._id}
          recordName={recordName(renewTarget.type, renewTarget.record)}
          currentExpiry={renewTarget.record.expiryDate}
        />
      )}

      {logTarget && (
        <LogContactDialog
          open
          onOpenChange={(open) => !open && setLogTarget(null)}
          type={logTarget.type}
          recordId={logTarget.record._id}
          recordName={recordName(logTarget.type, logTarget.record)}
        />
      )}

      {viewTarget && (
        <RecordDetailSheet
          open
          onOpenChange={(open) => !open && setViewTarget(null)}
          type={viewTarget.type}
          recordId={viewTarget.id}
          canWrite={canWrite}
          canSeeCredentials={canSeeCredentials}
          onEdit={(record) => fromSheet(() => openForm(viewTarget.type, record))}
          onRenew={(record) => fromSheet(() => setRenewTarget({ type: viewTarget.type, record }))}
          onLogContact={(record) => fromSheet(() => setLogTarget({ type: viewTarget.type, record }))}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this record?"
        description={
          deleteTarget
            ? `${recordName(deleteTarget.type, deleteTarget.record)} will be removed from the list. Its renewal history is kept.`
            : ""
        }
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
