"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  BarChart3,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderKanban,
  Globe,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  Upload,
  Users,
  Wallet,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IClient, IClientDocument, IClientNote } from "@/types/clients";
import {
  formatCurrency,
  formatNumber,
  getClientFullName,
} from "@/features/clients/utils/client.utils";

import { ClientAvatar } from "./client-avatar";
import { ClientInfoCard } from "./client-info-card";
import { ClientStatusBadge } from "./client-status-badge";
import { ClientTimeline } from "./client-timeline";
import { ClientTypeBadge } from "./client-type-badge";
import { DocumentItem } from "./document-item";
import { RevenueCard } from "./revenue-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ClientDetailsSheetProps {
  client: IClient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional — footer "Edit Client" button only renders when provided. */
  onEdit?: (client: IClient) => void;
  /** Optional — footer "Add Note" button only renders when provided. */
  onAddNote?: (client: IClient) => void;
}

/* -------------------------------------------------------------------------- */
/*  Project types (shape returned by the backend `projects` array)            */
/* -------------------------------------------------------------------------- */

interface ProjectUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  designation?: string;
}

interface ClientProject {
  _id: string;
  name: string;
  type: string;
  status: string;
  paymentStatus?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
  liveUrl?: string;
  projectManager?: ProjectUser | null;
  developers?: ProjectUser[];
  payments?: { amount: number }[];
}

const COMPLETED_STATUSES = ["COMPLETED", "DELIVERED", "DONE_DUE"];
const ACTIVE_STATUSES = ["IN_PROGRESS"];

const PROJECT_STATUS_STYLES: Record<string, string> = {
  PLANNING: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  IN_PROGRESS:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ON_HOLD:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  COMPLETED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  DELIVERED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  DONE_DUE:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  PENDING:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  DUE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  PARTIAL:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ADVANCED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const labelize = (value?: string) =>
  value
    ? value
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "—";

const getProjectPaid = (project: ClientProject) =>
  (project.payments ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0);

const getProjectDue = (project: ClientProject) =>
  Math.max((project.budget ?? 0) - getProjectPaid(project), 0);

function buildProjectStats(projects: ClientProject[]) {
  const total = projects.length;
  const completed = projects.filter((p) =>
    COMPLETED_STATUSES.includes(p.status),
  ).length;
  const active = projects.filter((p) =>
    ACTIVE_STATUSES.includes(p.status),
  ).length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget ?? 0), 0);
  const totalPaid = projects.reduce((sum, p) => sum + getProjectPaid(p), 0);
  const totalDue = projects.reduce((sum, p) => sum + getProjectDue(p), 0);
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    active,
    totalBudget,
    totalPaid,
    totalDue,
    completionRate,
  };
}

/* -------------------------------------------------------------------------- */
/*  Activity                                                                  */
/* -------------------------------------------------------------------------- */

type ActivityEntry =
  | { type: "note"; date: string; actor?: string; text: string }
  | { type: "document"; date: string; actor?: string; text: string };

function buildActivityFeed(client: IClient): ActivityEntry[] {
  const noteEntries: ActivityEntry[] = (client.notes ?? []).map(
    (note: IClientNote) => ({
      type: "note",
      date: note.createdAt,
      actor: note.createdBy
        ? `${note.createdBy.firstName} ${note.createdBy.lastName}`
        : undefined,
      text: note.message,
    }),
  );

  const documentEntries: ActivityEntry[] = (client.documents ?? []).map(
    (doc: IClientDocument) => ({
      type: "document",
      date: doc.createdAt,
      actor: doc.uploadedBy
        ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`
        : undefined,
      text: doc.title,
    }),
  );

  return [...noteEntries, ...documentEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function AboutItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
      <p
        className={cn("text-lg font-semibold text-foreground", valueClassName)}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const Icon = entry.type === "note" ? StickyNote : Upload;

  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          entry.type === "note"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        )}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {entry.type === "note" ? "Note added" : "Document uploaded"}
        </p>
        <p className="truncate text-sm text-muted-foreground">{entry.text}</p>
        <p className="mt-0.5 text-xs text-muted-foreground/70">
          {entry.actor ? `${entry.actor} · ` : ""}
          {format(new Date(entry.date), "MMM dd, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Project card                                                              */
/* -------------------------------------------------------------------------- */

function ProjectCard({ project }: { project: ClientProject }) {
  const paid = getProjectPaid(project);
  const due = getProjectDue(project);
  const manager = project.projectManager
    ? `${project.projectManager.firstName} ${project.projectManager.lastName}`
    : "Unassigned";

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardContent className="space-y-4 p-4">
        {/* Title + badges */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-sm font-semibold text-foreground">
                {project.name}
              </h4>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label={`Open ${project.name}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {labelize(project.type)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="secondary"
              className={cn(
                "rounded-md border-0 font-medium",
                PROJECT_STATUS_STYLES[project.status],
              )}
            >
              {labelize(project.status)}
            </Badge>
            {project.paymentStatus && (
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-md border-0 font-medium",
                  PAYMENT_STATUS_STYLES[project.paymentStatus],
                )}
              >
                {labelize(project.paymentStatus)}
              </Badge>
            )}
          </div>
        </div>

        {/* Money */}
        <div className="grid grid-cols-3 gap-2">
          <StatPill label="Budget" value={formatCurrency(project.budget ?? 0)} />
          <StatPill
            label="Paid"
            value={formatCurrency(paid)}
            valueClassName="text-emerald-600 dark:text-emerald-400"
          />
          <StatPill
            label="Due"
            value={formatCurrency(due)}
            valueClassName={
              due > 0 ? "text-red-600 dark:text-red-400" : undefined
            }
          />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AboutItem icon={Users} label="Project Manager" value={manager} />
          <AboutItem
            icon={Calendar}
            label="Timeline"
            value={
              project.startDate
                ? `${format(new Date(project.startDate), "MMM dd, yyyy")}${
                    project.endDate
                      ? ` → ${format(new Date(project.endDate), "MMM dd, yyyy")}`
                      : ""
                  }`
                : "—"
            }
          />
        </div>

        {/* Developers */}
        {(project.developers?.length ?? 0) > 0 && (
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Developers</p>
            <div className="flex flex-wrap gap-1.5">
              {project.developers!.map((dev) => (
                <Badge
                  key={dev._id}
                  variant="outline"
                  className="rounded-md font-normal"
                >
                  {dev.firstName} {dev.lastName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        {(project.technologies?.length ?? 0) > 0 && (
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Technologies</p>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies!.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="rounded-md font-normal"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sheet                                                                     */
/* -------------------------------------------------------------------------- */

export function ClientDetailsSheet({
  client,
  open,
  onOpenChange,
  onEdit,
  onAddNote,
}: ClientDetailsSheetProps) {
  const activity = useMemo(() => buildActivityFeed(client), [client]);

  const projects = useMemo(
    () => ((client as any).projects ?? []) as ClientProject[],
    [client],
  );
  const projectStats = useMemo(() => buildProjectStats(projects), [projects]);

  const location = [client.city, client.state, client.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-5xl">
        {/* Header */}
        <SheetHeader className="space-y-4 border-b border-border/60 px-6 pb-5 pt-6">
          <div className="flex items-start gap-4">
            <ClientAvatar client={client} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-xl font-semibold">
                  {getClientFullName(client)}
                </SheetTitle>
                <ClientStatusBadge status={client.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {client.clientCode}
                {client.companyName ? ` · ${client.companyName}` : ""}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {client.leadId?.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    {client.leadId?.phone}
                  </span>
                )}
                {client.leadId?.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    {client.leadId?.email}
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <Tabs
          defaultValue="overview"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <ScrollArea className="max-w-3xl px-4">
            {" "}
            <TabsList className="h-auto w-full justify-start rounded-xl gap-1 border-b border-indigo-200 py-2 bg-indigo-600 px-6">
              {[
                { value: "overview", label: "Overview" },
                { value: "details", label: "Details" },
                {
                  value: "projects",
                  label: `Projects (${projectStats.total})`,
                },
                {
                  value: "notes",
                  label: `Notes (${client.notes?.length ?? 0})`,
                },
                {
                  value: "documents",
                  label: `Documents (${client.documents?.length ?? 0})`,
                },
                { value: "activity", label: "Activity" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="border-b-2 *:border-transparent rounded-xl px-3 py-2.5 text-sm font-medium dark:text-white text-white/90 shadow-none data-[state=active]:border-indigo-300 data-[state=active]:bg-teal-700 dark:data-[state=active]:border-indigo-300 dark:data-[state=active]:bg-teal-700 data-[state=active]:text-white data-[state=active]:shadow-none dark:data-[state=active]:text-white dark:data-[state=active]:shadow-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <ScrollArea className="flex-1 overflow-hidden">
            <div className="flex-1 px-6 py-5">
              {/* Overview */}
              <TabsContent value="overview" className="mt-0 space-y-5">
                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      About Client
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <AboutItem
                      icon={Briefcase}
                      label="Client Type"
                      value={<ClientTypeBadge type={client.clientType} />}
                    />
                    <AboutItem
                      icon={BarChart3}
                      label="Industry"
                      value={client.industry || "—"}
                    />
                    <AboutItem
                      icon={Building}
                      label="Company Size"
                      value={client.companySize || "—"}
                    />
                    <AboutItem
                      icon={Calendar}
                      label="Joined Date"
                      value={
                        client.joinedAt
                          ? format(new Date(client.joinedAt), "MMM dd, yyyy")
                          : "—"
                      }
                    />
                    <AboutItem
                      icon={Users}
                      label="Account Manager"
                      value={
                        client.accountManager
                          ? `${client.accountManager.firstName} ${client.accountManager.lastName}`
                          : "Unassigned"
                      }
                    />
                  </CardContent>
                </Card>

                <RevenueCard client={client} />

                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Financial Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatPill
                      label="Total Revenue"
                      value={formatCurrency(client.totalRevenue)}
                    />
                    <StatPill
                      label="Total Paid"
                      value={formatCurrency(client.totalPaid)}
                      valueClassName="text-emerald-600 dark:text-emerald-400"
                    />
                    <StatPill
                      label="Total Due"
                      value={formatCurrency(client.totalDue)}
                      valueClassName={
                        client.totalDue > 0
                          ? "text-red-600 dark:text-red-400"
                          : undefined
                      }
                    />
                    <StatPill
                      label="Total Invoices"
                      value={formatNumber(client.totalInvoices)}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Projects Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatPill
                      label="Total Projects"
                      value={formatNumber(projectStats.total)}
                    />
                    <StatPill
                      label="Completed"
                      value={formatNumber(projectStats.completed)}
                      valueClassName="text-emerald-600 dark:text-emerald-400"
                    />
                    <StatPill
                      label="In Progress"
                      value={formatNumber(projectStats.active)}
                      valueClassName="text-amber-600 dark:text-amber-400"
                    />
                    <StatPill
                      label="Total Budget"
                      value={formatCurrency(projectStats.totalBudget)}
                    />
                  </CardContent>
                </Card>

                {(client.tags?.length > 0 || client.labels?.length > 0) && (
                  <Card className="rounded-2xl border-border/70 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Tags & Labels
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {client.tags?.length > 0 && (
                        <div>
                          <p className="mb-1.5 text-xs text-muted-foreground">
                            Tags
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {client.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="rounded-md font-normal"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {client.labels?.length > 0 && (
                        <div>
                          <p className="mb-1.5 text-xs text-muted-foreground">
                            Labels
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {client.labels.map((label) => (
                              <Badge
                                key={label}
                                variant="outline"
                                className="rounded-md border-primary/30 font-normal text-primary"
                              >
                                {label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Last Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activity.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        No activity yet.
                      </p>
                    ) : (
                      activity
                        .slice(0, 3)
                        .map((entry, index) => (
                          <ActivityRow
                            key={`${entry.type}-${index}`}
                            entry={entry}
                          />
                        ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details (contact + company) */}
              <TabsContent value="details" className="mt-0 space-y-4">
                <ClientInfoCard client={client} />

                {client.companyName && (
                  <Card className="rounded-2xl border-border/70 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Company Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <AboutItem
                        icon={Building}
                        label="Company"
                        value={client.companyName}
                      />
                      {client.industry && (
                        <AboutItem
                          icon={BarChart3}
                          label="Industry"
                          value={client.industry}
                        />
                      )}
                      {client.companyWebsite && (
                        <AboutItem
                          icon={Globe}
                          label="Website"
                          value={
                            <a
                              href={client.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {client.companyWebsite}
                            </a>
                          }
                        />
                      )}
                      {client.joinedAt && (
                        <AboutItem
                          icon={Calendar}
                          label="Joined Date"
                          value={format(
                            new Date(client.joinedAt),
                            "MMM dd, yyyy",
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Projects */}
              <TabsContent value="projects" className="mt-0 space-y-4">
                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Project Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FolderKanban className="h-4 w-4" aria-hidden="true" />
                        Total Projects
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        {formatNumber(projectStats.total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        Active Projects
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        {formatNumber(projectStats.active)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Completion Rate
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        {projectStats.completionRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wallet className="h-4 w-4" aria-hidden="true" />
                        Total Budget
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        {formatCurrency(projectStats.totalBudget)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Paid / Due
                      </span>
                      <span className="text-base font-semibold">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(projectStats.totalPaid)}
                        </span>
                        <span className="mx-1.5 text-muted-foreground">/</span>
                        <span
                          className={
                            projectStats.totalDue > 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-foreground"
                          }
                        >
                          {formatCurrency(projectStats.totalDue)}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {projects.length === 0 ? (
                  <Card className="rounded-2xl border-border/70 shadow-sm">
                    <CardContent className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No projects yet
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Notes */}
              <TabsContent value="notes" className="mt-0">
                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardContent className="pt-6">
                    {client.notes && client.notes.length > 0 ? (
                      <ClientTimeline notes={client.notes} />
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          No notes yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents" className="mt-0">
                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardContent className="pt-6">
                    {client.documents && client.documents.length > 0 ? (
                      <div className="space-y-3">
                        {client.documents.map((doc) => (
                          <DocumentItem key={doc._id} document={doc} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          No documents uploaded
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity */}
              <TabsContent value="activity" className="mt-0">
                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardContent className="space-y-5 pt-6">
                    {activity.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No activity yet.
                      </p>
                    ) : (
                      activity.map((entry, index) => (
                        <ActivityRow
                          key={`${entry.type}-${index}`}
                          entry={entry}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </Tabs>

        {/* Footer actions */}
        {(onEdit || onAddNote) && (
          <div className="flex items-center justify-end gap-2 border-t border-border/60 px-6 py-4">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(client)}>
                Edit Client
              </Button>
            )}
            {onAddNote && (
              <Button
                onClick={() => onAddNote(client)}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Add Note
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}