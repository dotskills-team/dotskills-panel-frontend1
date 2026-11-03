"use client";

import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { AlertCircle, BellRing, Eye, Phone, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ExpiryBadge, StatusBadge } from "./status-badges";
import {
  useDomainHostingList,
  useDomainHostingSummary,
  useMarkNotificationRead,
  useReminderNotifications,
} from "@/features/domain-hosting/hooks/use-domain-hosting";
import type {
  DomainRecord,
  HostingRecord,
  ReminderItem,
  TargetRecord,
  TargetType,
} from "@/types/domain-hosting.types";

interface OverviewTabProps {
  canWrite: boolean;
  onView: (type: TargetType, record: TargetRecord) => void;
  onRenew: (type: TargetType, record: TargetRecord) => void;
  onLogContact: (type: TargetType, record: TargetRecord) => void;
  onOpenReminder: (type: TargetType, id: string) => void;
}

const NEEDS_ACTION_WINDOW_DAYS = 30;
const NEEDS_ACTION_LIMIT = 20;

interface NeedsActionRow {
  type: TargetType;
  record: TargetRecord;
}

function SummaryCard({
  title,
  value,
  accent,
  hint,
  loading,
}: {
  title: string;
  value: number | string;
  accent: string;
  hint: string;
  loading: boolean;
}) {
  return (
    <Card className={cn("border-l-4 py-4", accent)}>
      <CardContent className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-3xl font-semibold tabular-nums">{value}</p>}
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function ReminderRow({
  reminder,
  canWrite,
  onOpen,
  onMarkRead,
  markingId,
}: {
  reminder: ReminderItem;
  canWrite: boolean;
  onOpen: () => void;
  onMarkRead: () => void;
  markingId: string | null;
}) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span
        className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", reminder.isRead ? "bg-transparent" : "bg-indigo-500")}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className={cn("text-sm", reminder.isRead ? "text-muted-foreground" : "font-medium")}>{reminder.title}</p>
        <p className="text-xs text-muted-foreground">{reminder.message}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onOpen}>
            Open record
          </Button>
          {canWrite && !reminder.isRead && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={onMarkRead}
              disabled={markingId === reminder._id}
            >
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export function OverviewTab({ canWrite, onView, onRenew, onLogContact, onOpenReminder }: OverviewTabProps) {
  // Fixed when the tab mounts, so the window does not shift on every render
  const [windowEnd] = useState(() => format(addDays(new Date(), NEEDS_ACTION_WINDOW_DAYS), "yyyy-MM-dd"));

  const summaryQuery = useDomainHostingSummary();
  const domainsQuery = useDomainHostingList("domain", {
    page: 1,
    limit: NEEDS_ACTION_LIMIT,
    sort: "expiryDate",
    expiryTo: windowEnd,
  });
  const hostingQuery = useDomainHostingList("hosting", {
    page: 1,
    limit: NEEDS_ACTION_LIMIT,
    sort: "expiryDate",
    expiryTo: windowEnd,
  });
  const remindersQuery = useReminderNotifications(canWrite);
  const markRead = useMarkNotificationRead();

  const summary = summaryQuery.data;
  const summaryLoading = summaryQuery.isLoading;

  // Merge domains and hosting into one list, nearest expiry first, cancelled items left out
  const needsAction = useMemo<NeedsActionRow[]>(() => {
    const domainRows: NeedsActionRow[] = (domainsQuery.data?.data ?? []).map((record) => ({
      type: "domain",
      record,
    }));
    const hostingRows: NeedsActionRow[] = (hostingQuery.data?.data ?? []).map((record) => ({
      type: "hosting",
      record,
    }));

    return [...domainRows, ...hostingRows]
      .filter((row) => row.record.status !== "cancelled")
      .sort((a, b) => new Date(a.record.expiryDate).getTime() - new Date(b.record.expiryDate).getTime())
      .slice(0, NEEDS_ACTION_LIMIT);
  }, [domainsQuery.data, hostingQuery.data]);

  const listsLoading = domainsQuery.isLoading || hostingQuery.isLoading;
  const listsError = domainsQuery.isError || hostingQuery.isError;

  const costEntries = Object.entries(summary?.upcomingRenewalCost ?? {});

  return (
    <div className="space-y-6">
      {/* ------------------------------ Summary cards ------------------------------ */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <SummaryCard
          title="Expired"
          value={summary?.expired ?? 0}
          accent="border-l-red-500"
          hint="Past expiry date"
          loading={summaryLoading}
        />
        <SummaryCard
          title="Expiring in 7 days"
          value={summary?.expiringWithin7Days ?? 0}
          accent="border-l-orange-500"
          hint="Within the next 7 days"
          loading={summaryLoading}
        />
        <SummaryCard
          title="Expiring in 15 days"
          value={summary?.expiringWithin15Days ?? 0}
          accent="border-l-yellow-500"
          hint="Within the next 15 days"
          loading={summaryLoading}
        />
        <SummaryCard
          title="Expiring in 30 days"
          value={summary?.expiringWithin30Days ?? 0}
          accent="border-l-amber-400"
          hint="Within the next 30 days"
          loading={summaryLoading}
        />
        <SummaryCard
          title="Active"
          value={summary?.totalActive ?? 0}
          accent="border-l-emerald-500"
          hint="Not expired or cancelled"
          loading={summaryLoading}
        />
      </div>

      <Card className="py-4">
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="font-medium">Renewal cost due in 30 days</span>
          {summaryLoading && <Skeleton className="h-5 w-40" />}
          {!summaryLoading && costEntries.length === 0 && <span className="text-muted-foreground">Nothing due</span>}
          {!summaryLoading &&
            costEntries.map(([currency, total]) => (
              <span key={currency} className="tabular-nums">
                {currency} {total.toLocaleString()}
              </span>
            ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* -------------------------------- Needs action ----------------------------- */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Needs action</CardTitle>
            <p className="text-sm text-muted-foreground">
              Expired or expiring within {NEEDS_ACTION_WINDOW_DAYS} days, nearest first.
            </p>
          </CardHeader>
          <CardContent>
            {listsLoading && (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}

            {!listsLoading && listsError && (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-destructive">Failed to load items that need action.</p>
                <Button size="sm" onClick={() => { domainsQuery.refetch(); hostingQuery.refetch(); }}>
                  Try again
                </Button>
              </div>
            )}

            {!listsLoading && !listsError && needsAction.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Nothing needs action right now. All tracked items are safe for the next {NEEDS_ACTION_WINDOW_DAYS} days.
              </div>
            )}

            {!listsLoading && !listsError && needsAction.length > 0 && (
              <div className="divide-y">
                {needsAction.map(({ type, record }) => {
                  const name =
                    type === "domain"
                      ? (record as DomainRecord).domainName
                      : (record as HostingRecord).provider || "Hosting";
                  return (
                    <div key={`${type}-${record._id}`} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] uppercase">
                            {type}
                          </Badge>
                          <span className="truncate font-medium">{name}</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{record.clientName || "No client"}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatDate(record.expiryDate)}</span>
                        <ExpiryBadge daysLeft={record.daysLeft} />
                        <StatusBadge status={record.status} />
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onView(type, record)} aria-label="View record">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canWrite && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => onLogContact(type, record)} aria-label="Log client contact">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => onRenew(type, record)}>
                              <RefreshCw className="h-4 w-4" />
                              Renew
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ----------------------------------- Reminders ---------------------------- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Reminders
              </span>
              {(remindersQuery.data?.unreadCount ?? 0) > 0 && (
                <Badge className="bg-indigo-600 text-white">{remindersQuery.data?.unreadCount} new</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!canWrite && <p className="text-sm text-muted-foreground">Reminders are shown to admins only.</p>}

            {canWrite && remindersQuery.isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            )}

            {canWrite && remindersQuery.isError && (
              <p className="text-sm text-destructive">Unable to load reminders.</p>
            )}

            {canWrite && remindersQuery.data && remindersQuery.data.items.length === 0 && (
              <p className="text-sm text-muted-foreground">No reminders yet. They appear 30, 15, 7, 3, 1 and 0 days before expiry.</p>
            )}

            {canWrite && remindersQuery.data && remindersQuery.data.items.length > 0 && (
              <ul className="divide-y">
                {remindersQuery.data.items.map((reminder) => (
                  <ReminderRow
                    key={reminder._id}
                    reminder={reminder}
                    canWrite={canWrite}
                    onOpen={() => onOpenReminder(reminder.targetType, reminder.targetId)}
                    onMarkRead={() => markRead.mutate(reminder._id)}
                    markingId={markRead.isPending ? (markRead.variables ?? null) : null}
                  />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
