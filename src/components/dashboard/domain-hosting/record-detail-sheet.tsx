"use client";

import Link from "next/link";
import {
  CalendarClock,
  History,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { CredentialPasswordField } from "./credential-password-field";
import { ExpiryBadge, StatusBadge } from "./status-badges";
import {
  BILLING_CYCLE_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  HOSTING_TYPE_OPTIONS,
  LOG_ACTION_LABEL,
} from "@/features/domain-hosting/constants/domain-hosting.constant";
import { useDomainHostingDetail, useRenewalLogs } from "@/features/domain-hosting/hooks/use-domain-hosting";
import type {
  ContactMethod,
  DomainRecord,
  HostingRecord,
  RenewalLogRecord,
  TargetRecord,
  TargetType,
} from "@/types/domain-hosting.types";

interface RecordDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TargetType;
  recordId: string | null;
  canWrite: boolean;
  canSeeCredentials: boolean;
  onEdit: (record: TargetRecord) => void;
  onRenew: (record: TargetRecord) => void;
  onLogContact: (record: TargetRecord) => void;
}

const formatMoney = (amount: number | undefined, currency: string) =>
  amount === undefined ? "—" : `${currency} ${amount.toLocaleString()}`;

const CONTACT_ICON: Record<ContactMethod, typeof Phone> = {
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  other: MessageSquare,
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}

/** One row of the renewal / contact timeline. */
function TimelineItem({ log }: { log: RenewalLogRecord }) {
  const Icon = log.action === "renewed" ? RefreshCw : log.contactMethod ? CONTACT_ICON[log.contactMethod] : History;
  const methodLabel = CONTACT_METHOD_OPTIONS.find((option) => option.value === log.contactMethod)?.label;

  return (
    <li className="relative pb-6 pl-8 last:pb-0">
      <span className="absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border bg-background">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{LOG_ACTION_LABEL[log.action]}</span>
          {methodLabel && <Badge variant="secondary">{methodLabel}</Badge>}
          <span className="text-xs text-muted-foreground">{formatDate(log.createdAt, "dd MMM yyyy, hh:mm a")}</span>
        </div>

        {log.action === "renewed" && (
          <p className="text-xs text-muted-foreground">
            Expiry {log.oldExpiryDate ? formatDate(log.oldExpiryDate) : "—"} → {log.newExpiryDate ? formatDate(log.newExpiryDate) : "—"}
            {typeof log.amountPaid === "number" && log.amountPaid > 0 && ` · Paid ${log.amountPaid.toLocaleString()}`}
          </p>
        )}

        {log.note && <p className="whitespace-pre-wrap text-sm text-muted-foreground">{log.note}</p>}

        {log.createdBy && (
          <p className="text-xs text-muted-foreground">by {log.createdBy.fullName || log.createdBy.email || "Unknown user"}</p>
        )}
      </div>
    </li>
  );
}

function DomainDetails({ record, canSeeCredentials, recordId }: { record: DomainRecord; canSeeCredentials: boolean; recordId: string }) {
  return (
    <>
      <dl className="grid grid-cols-2 gap-4">
        <InfoRow label="Client" value={record.clientName} />
        <InfoRow label="Registrar" value={record.registrar} />
        <InfoRow label="Purchase date" value={record.purchaseDate ? formatDate(record.purchaseDate) : ""} />
        <InfoRow label="Paid by" value={record.paidBy === "client" ? "Client" : "Company"} />
        <InfoRow label="Purchase price" value={formatMoney(record.purchasePrice, record.currency)} />
        <InfoRow label="Renewal price" value={formatMoney(record.renewalPrice, record.currency)} />
        <InfoRow label="Auto-renew" value={record.autoRenew ? "Yes" : "No"} />
        <InfoRow label="WHOIS privacy" value={record.whoisPrivacy ? "Yes" : "No"} />
        <InfoRow label="Last renewed" value={record.lastRenewedAt ? formatDate(record.lastRenewedAt) : ""} />
        <InfoRow label="Last payment" value={formatMoney(record.lastPaidAmount, record.currency)} />
      </dl>

      {record.registrarUrl && (
        <Link href={record.registrarUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 underline">
          Open registrar
        </Link>
      )}

      {record.nameservers.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Nameservers</p>
          <ul className="space-y-0.5 font-mono text-sm">
            {record.nameservers.map((ns) => (
              <li key={ns}>{ns}</li>
            ))}
          </ul>
        </div>
      )}

      {record.dnsNotes && <InfoRow label="DNS notes" value={<span className="whitespace-pre-wrap">{record.dnsNotes}</span>} />}

      {canSeeCredentials && record.credentials && (
        <section className="space-y-3 rounded-lg border p-4">
          <h3 className="text-sm font-semibold">Credentials</h3>
          <dl className="grid grid-cols-2 gap-4">
            <InfoRow label="Login URL" value={record.credentials.loginUrl} />
            <InfoRow label="Username" value={record.credentials.username} />
            <InfoRow label="2FA note" value={record.credentials.twoFactorNote} />
          </dl>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Password</p>
            <CredentialPasswordField
              type="domain"
              recordId={recordId}
              hasPassword={Boolean(record.credentials.hasPassword)}
            />
          </div>
        </section>
      )}
    </>
  );
}

function HostingDetails({ record, canSeeCredentials, recordId }: { record: HostingRecord; canSeeCredentials: boolean; recordId: string }) {
  const hostingTypeLabel = HOSTING_TYPE_OPTIONS.find((option) => option.value === record.hostingType)?.label;
  const billingLabel = BILLING_CYCLE_OPTIONS.find((option) => option.value === record.billingCycle)?.label;

  return (
    <>
      <dl className="grid grid-cols-2 gap-4">
        <InfoRow label="Client" value={record.clientName} />
        <InfoRow label="Provider" value={record.provider} />
        <InfoRow label="Hosting type" value={hostingTypeLabel} />
        <InfoRow label="Plan" value={record.planName} />
        <InfoRow label="Server location" value={record.serverLocation} />
        <InfoRow label="Server IP" value={record.serverIp} />
        <InfoRow label="Control panel" value={record.controlPanel} />
        <InfoRow label="Billing cycle" value={billingLabel} />
        <InfoRow label="Purchase date" value={record.purchaseDate ? formatDate(record.purchaseDate) : ""} />
        <InfoRow label="Paid by" value={record.paidBy === "client" ? "Client" : "Company"} />
        <InfoRow label="Purchase price" value={formatMoney(record.purchasePrice, record.currency)} />
        <InfoRow label="Renewal price" value={formatMoney(record.renewalPrice, record.currency)} />
      </dl>

      {record.controlPanelUrl && (
        <Link href={record.controlPanelUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-900 pb-2 inline-block underline">
          Open control panel
        </Link>
      )}

      {record.linkedDomains.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Linked domains</p>
          <div className="flex flex-wrap gap-2">
            {record.linkedDomains.map((domain) => (
              <Badge key={domain._id} variant="secondary">
                {domain.domainName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {canSeeCredentials && record.credentials && record.credentials.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Credentials</h3>
          {record.credentials.map((row) => (
            <div key={row._id} className="space-y-2 rounded-lg border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{row.label}</span>
                {row.port ? <Badge variant="outline">Port {row.port}</Badge> : null}
              </div>
              <dl className="grid grid-cols-2 gap-4">
                <InfoRow label="Login URL" value={row.loginUrl} />
                <InfoRow label="Username" value={row.username} />
                <InfoRow label="Note" value={row.note} />
              </dl>
              <CredentialPasswordField
                type="hosting"
                recordId={recordId}
                credentialId={row._id}
                hasPassword={Boolean(row.hasPassword)}
              />
            </div>
          ))}
        </section>
      )}
    </>
  );
}

export function RecordDetailSheet({
  open,
  onOpenChange,
  type,
  recordId,
  canWrite,
  canSeeCredentials,
  onEdit,
  onRenew,
  onLogContact,
}: RecordDetailSheetProps) {
  const detailQuery = useDomainHostingDetail(type, open ? recordId : null);
  const logsQuery = useRenewalLogs(type, open ? recordId : null);

  const record = detailQuery.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl">
        <div className="space-y-6 p-6">
          <SheetHeader className="p-0">
            {detailQuery.isLoading || !record ? (
              <>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </>
            ) : (
              <>
                <SheetTitle className="break-all text-lg">
                  {type === "domain" ? (record as DomainRecord).domainName : (record as HostingRecord).provider || "Hosting"}
                </SheetTitle>
                <SheetDescription asChild>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={record.status} />
                    <ExpiryBadge daysLeft={record.daysLeft} />
                    <span className="text-xs text-muted-foreground">Expires {formatDate(record.expiryDate)}</span>
                  </div>
                </SheetDescription>
              </>
            )}
          </SheetHeader>

          {detailQuery.isError && (
            <p className="text-sm text-destructive">Unable to load the record. Close and try again.</p>
          )}

          {record && (
            <>
              {canWrite && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(record)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => onRenew(record)}>
                    <RefreshCw className="h-4 w-4" />
                    Renew
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onLogContact(record)}>
                    <Phone className="h-4 w-4" />
                    Log contact
                  </Button>
                </div>
              )}

              {type === "domain" ? (
                <DomainDetails record={record as DomainRecord} canSeeCredentials={canSeeCredentials} recordId={record._id} />
              ) : (
                <HostingDetails record={record as HostingRecord} canSeeCredentials={canSeeCredentials} recordId={record._id} />
              )}

              {record.notes && (
                <section className="space-y-1">
                  <h3 className="text-sm font-semibold">Notes</h3>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{record.notes}</p>
                </section>
              )}
            </>
          )}

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <CalendarClock className="h-4 w-4" />
              Renewal & contact history
            </h3>

            {logsQuery.isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-5/6" />
              </div>
            )}

            {logsQuery.isError && <p className="text-sm text-destructive">Unable to load the history.</p>}

            {logsQuery.data && logsQuery.data.length === 0 && (
              <p className="text-sm text-muted-foreground">No renewals or contacts recorded yet.</p>
            )}

            {logsQuery.data && logsQuery.data.length > 0 && (
              <ol className="relative space-y-0 border-l pl-0">
                {logsQuery.data.map((log) => (
                  <TimelineItem key={log._id} log={log} />
                ))}
              </ol>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
