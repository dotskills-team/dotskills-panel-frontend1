
// "use client";

// import {
//   CalendarDays,
//   CheckCircle2,
//   Circle,
//   CreditCard,
//   ExternalLink,
//   FileText,
//   Flag,
//   Github,
//   Globe,
//   Pencil,
//   Rocket,
//   Wallet,
// } from "lucide-react";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import type { IProject } from "@/types/project.types";
// import { PaymentStatus } from "@/types/project.types";
// import { PROJECT_STATUS_CONFIG, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
// import { getUserFullName } from "@/features/users/utils/user.utils";
// import { formatCurrency, formatDate } from "@/features/project/utils/project.utils";

// const TYPE_LABELS = Object.fromEntries(
//   PROJECT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
// );

// const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
//   [PaymentStatus.DUE]: "Due",
//   [PaymentStatus.PARTIAL]: "Partial",
//   [PaymentStatus.ADVANCED]: "Advanced",
//   [PaymentStatus.COMPLETE]: "Complete",
// };

// const PAYMENT_STATUS_CLASSNAMES: Record<PaymentStatus, string> = {
//   [PaymentStatus.DUE]: "border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
//   [PaymentStatus.PARTIAL]: "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
//   [PaymentStatus.ADVANCED]: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
//   [PaymentStatus.COMPLETE]: "border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
// };

// interface ProjectDetailsDialogProps {
//   project: IProject | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onEdit: (project: IProject) => void;
// }

// function initials(firstName?: string, lastName?: string) {
//   return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
// }

// function InfoItem({
//   icon: Icon,
//   label,
//   value,
//   valueClassName,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: React.ReactNode;
//   valueClassName?: string;
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-indigo-600/10 text-indigo-600">
//         <Icon className="h-4 w-4" />
//       </div>
//       <div className="flex flex-col">
//         <span className="text-xs text-muted-foreground">{label}</span>
//         <span className={`text-sm font-medium ${valueClassName ?? ""}`}>{value}</span>
//       </div>
//     </div>
//   );
// }

// function LinkRow({
//   icon: Icon,
//   label,
//   url,
// }: {
//   icon: React.ElementType;
//   label: string;
//   url?: string;
// }) {
//   if (!url) return null;
//   return (
//     <a
//       href={url}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
//     >
//       <span className="flex items-center gap-2">
//         <Icon className="h-4 w-4 text-muted-foreground" />
//         {label}
//       </span>
//       <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
//     </a>
//   );
// }

// export function ProjectDetailsDialog({
//   project,
//   open,
//   onOpenChange,
//   onEdit,
// }: ProjectDetailsDialogProps) {
//   if (!project) return null;

//   const statusConfig = PROJECT_STATUS_CONFIG[project.status];
//   const paymentStatus = project.paymentStatus;
//   // const totalPaid = (project.payments ?? [])
//   //   .filter((p) => p.status === ("COMPLETE" || "ADVANCED"))
//   //   .reduce((sum, p) => sum + (p.amount || 0), 0);
//   const totalPaid = (project.payments ?? [])
//     .filter((p) => p.status === PaymentStatus.COMPLETE || p.status === PaymentStatus.ADVANCED)
//     .reduce((sum, p) => sum + (p.amount || 0), 0);
//   const amountDue =
//     project.budget !== undefined && project.budget !== null
//       ? Math.max(project.budget - totalPaid, 0)
//       : undefined;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl overflow-hidden bg-gray-100 p-0 dark:bg-slate-950">
//         <div className="bg-linear-to-br from-indigo-600 to-cyan-700 px-6 py-5 text-white">
//           <DialogHeader>
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex flex-col gap-1.5">
//                 <span className="text-xs font-medium uppercase tracking-wide text-indigo-100">
//                   {TYPE_LABELS[project.type] ?? project.type}
//                 </span>
//                 <DialogTitle className="text-xl font-semibold text-white dark">
//                   {project.name}
//                 </DialogTitle>

//                 <span className="text-sm text-indigo-100">
//                   {getUserFullName(project.client)}
//                 </span>
//                 <span className="text-sm text-indigo-100">
//                   {project.client?.phone}

//                 </span>
//               </div>
//               <div className="flex shrink-0 flex-col items-end gap-2">
//                 <Badge
//                   variant="outline"
//                   className="border-white/30 bg-white/10 text-white"
//                 >
//                   {statusConfig.label}
//                 </Badge>
//                 {project.priority !== undefined && project.priority !== null && (
//                   <Badge
//                     variant="outline"
//                     className="gap-1 border-white/30 bg-white/10 text-white"
//                   >
//                     <Flag className="h-3 w-3" />
//                     Priority {project.priority}
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </DialogHeader>
//         </div>

//         <ScrollArea className="max-h-[70vh]">
//           <div className="flex flex-col gap-6 px-6 py-5">
//             <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <InfoItem icon={Wallet} label="Budget" value={formatCurrency(project.budget)} />
//               <InfoItem
//                 icon={CalendarDays}
//                 label="Timeline"
//                 value={`${formatDate(project.startDate)} — ${project.endDate ? formatDate(project.endDate) : "Ongoing"
//                   }`}
//               />
//             </section>

//             <Separator />

//             <section className="flex flex-col gap-4">
//               <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                 Team
//               </h3>
//               <div className="flex flex-wrap items-center gap-6">
//                 <div className="flex items-center gap-2.5">
//                   <Avatar className="h-9 w-9">
//                     <AvatarFallback className="bg-indigo-600 text-white">
//                       {initials(project.projectManager?.firstName, project.projectManager?.lastName)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-col">
//                     <span className="text-sm font-medium">
//                       {getUserFullName(project.projectManager)}
//                     </span>
//                     <span className="text-xs text-muted-foreground">Project Leader</span>
//                   </div>
//                 </div>

//                 {project.developers && project.developers.length > 0 && (
//                   <div className="flex items-center gap-2.5">
//                     <div className="flex -space-x-2">
//                       {project.developers.map((dev) => (
//                         <Avatar
//                           key={dev._id}
//                           className="h-9 w-9 border-2 border-gray-100 dark:border-slate-950"
//                           title={getUserFullName(dev)}
//                         >
//                           <AvatarFallback className="bg-cyan-700 text-white text-xs">
//                             {initials(dev.firstName, dev.lastName)}
//                           </AvatarFallback>
//                         </Avatar>
//                       ))}
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium">
//                         {project.developers.length} Developer
//                         {project.developers.length > 1 ? "s" : ""}
//                       </span>
//                       <span className="text-xs text-muted-foreground">
//                         {project.developers.map((dev) => getUserFullName(dev)).join(", ")}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {project.technologies?.length > 0 && (
//               <>
//                 <Separator />
//                 <section className="flex flex-col gap-3">
//                   <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                     Technologies
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {project.technologies.map((tech) => (
//                       <Badge key={tech} variant="outline">
//                         {tech}
//                       </Badge>
//                     ))}
//                   </div>
//                 </section>
//               </>
//             )}

//             {(project.liveUrl || project.developmentLiveUrl || project.repositoryUrl) && (
//               <>
//                 <Separator />
//                 <section className="flex flex-col gap-3">
//                   <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                     Links
//                   </h3>
//                   <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//                     <LinkRow icon={Rocket} label="Live Site" url={project.liveUrl} />
//                     <LinkRow icon={Globe} label="Development Site" url={project.developmentLiveUrl} />
//                     <LinkRow icon={Github} label="Repository" url={project.repositoryUrl} />
//                   </div>
//                 </section>
//               </>
//             )}

//             {project.description && (
//               <>
//                 <Separator />
//                 <section className="flex flex-col gap-2">
//                   <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                     Description
//                   </h3>
//                   <p className="text-sm leading-relaxed text-muted-foreground">
//                     {project.description}
//                   </p>
//                 </section>
//               </>
//             )}

//             {project.documents && project.documents.length > 0 && (
//               <>
//                 <Separator />
//                 <section className="flex flex-col gap-3">
//                   <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                     Documents &amp; Access Credentials
//                   </h3>
//                   <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//                     {project.documents.map((doc) => (
//                       <LinkRow
//                         key={doc._id ?? doc.link}
//                         icon={FileText}
//                         label={doc.requirement}
//                         url={doc.link}
//                       />
//                     ))}
//                   </div>
//                 </section>
//               </>
//             )}

//             {(paymentStatus || project.nextPaymentDate || (project.payments && project.payments.length > 0)) && (
//               <>
//                 <Separator />
//                 <section className="flex flex-col gap-3">
//                   <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                     Payment
//                   </h3>

//                   <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//                     {paymentStatus && (
//                       <div className="flex flex-col gap-1">
//                         <span className="text-xs text-muted-foreground">Status</span>
//                         <Badge
//                           variant="outline"
//                           className={`w-fit ${PAYMENT_STATUS_CLASSNAMES[paymentStatus]}`}
//                         >
//                           {PAYMENT_STATUS_LABELS[paymentStatus]}
//                         </Badge>
//                       </div>
//                     )}
//                     <InfoItem icon={CreditCard} label="Total Paid" value={formatCurrency(totalPaid)} />
//                     <InfoItem
//                       icon={Wallet}
//                       label="Amount Due"
//                       value={amountDue !== undefined ? formatCurrency(amountDue) : "—"}
//                       valueClassName="text-red-600 dark:text-red-400"
//                     />
//                     {project.nextPaymentDate && (
//                       <InfoItem
//                         icon={CalendarDays}
//                         label="Next Payment"
//                         value={formatDate(project.nextPaymentDate)}
//                       />
//                     )}
//                   </div>

//                   {project.payments && project.payments.length > 0 && (
//                     <div className="flex flex-col gap-2">
//                       <span className="text-xs text-muted-foreground">History</span>
//                       <div className="flex flex-col gap-2">
//                         {project.payments.map((payment) => (
//                           <div
//                             key={payment._id ?? `${payment.date}-${payment.amount}`}
//                             className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm"
//                           >
//                             <div className="flex items-center gap-2">
//                               <span className="font-medium">{formatCurrency(payment.amount)}</span>
//                               <span className="text-xs text-muted-foreground">
//                                 {formatDate(payment.date)}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <span className="text-xs text-muted-foreground">
//                                 {typeof payment.financialAccountId === "object" &&
//                                   payment.financialAccountId
//                                   ? payment.financialAccountId.accountName as any
//                                   : "No account"}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Badge
//                                 variant="outline"
//                                 className={`text-xs ${PAYMENT_STATUS_CLASSNAMES[payment.status]}`}
//                               >
//                                 {PAYMENT_STATUS_LABELS[payment.status]}
//                               </Badge>
//                               {payment.note && (
//                                 <span className="text-xs text-muted-foreground">{payment.note}</span>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {project.paymentSchedule && project.paymentSchedule.length > 0 && (
//                     <div className="flex flex-col gap-2">
//                       <span className="text-xs text-muted-foreground">Schedule</span>
//                       <div className="flex flex-col gap-2">
//                         {project.paymentSchedule.map((installment) => (
//                           <div
//                             key={installment._id ?? `${installment.installmentNo}-${installment.amount}`}
//                             className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm"
//                           >
//                             <div className="flex items-center gap-2">
//                               {installment.isCompleted ? (
//                                 <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
//                               ) : (
//                                 <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
//                               )}
//                               <span className="font-medium">{installment.installmentNo}</span>
//                               <span className="text-xs text-muted-foreground">
//                                 {formatDate(installment.projectionDate)}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <span className="text-xs text-muted-foreground">
//                                 {installment.paymentPercentage}%
//                               </span>
//                               <span className="font-medium">{formatCurrency(installment.amount)}</span>
//                               <Badge
//                                 variant="outline"
//                                 className={
//                                   installment.isCompleted
//                                     ? "border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
//                                     : "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
//                                 }
//                               >
//                                 {installment.isCompleted ? "Completed" : "Pending"}
//                               </Badge>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </section>
//               </>
//             )}

//             <Separator />
//             <p className="text-xs text-muted-foreground">
//               Created {formatDate(project.createdAt)} · Last updated {formatDate(project.updatedAt)}
//             </p>
//           </div>
//           <ScrollBar orientation="vertical" />
//         </ScrollArea>

//         <div className="flex items-center justify-end gap-2 border-t bg-gray-100 px-6 py-3 dark:bg-slate-950">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Close
//           </Button>
//           <Button
//             onClick={() => {
//               onOpenChange(false);
//               onEdit(project);
//             }}
//             className="gap-2 bg-indigo-600 text-white hover:bg-cyan-800"
//           >
//             <Pencil className="h-3.5 w-3.5" />
//             Edit Project
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import {
  CalendarDays,
  CheckCircle2,
  Circle,
  CreditCard,
  ExternalLink,
  FileText,
  Flag,
  Github,
  Globe,
  Pencil,
  Rocket,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { IDeveloperProject, IProject } from "@/types/project.types";
import { PaymentStatus } from "@/types/project.types";
import { PROJECT_STATUS_CONFIG, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
import { getUserFullName } from "@/features/users/utils/user.utils";
import { formatCurrency, formatDate } from "@/features/project/utils/project.utils";

const TYPE_LABELS = Object.fromEntries(
  PROJECT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.DUE]: "Due",
  [PaymentStatus.PARTIAL]: "Partial",
  [PaymentStatus.ADVANCED]: "Advanced",
  [PaymentStatus.COMPLETE]: "Complete",
};

const PAYMENT_STATUS_CLASSNAMES: Record<PaymentStatus, string> = {
  [PaymentStatus.DUE]: "border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  [PaymentStatus.PARTIAL]: "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  [PaymentStatus.ADVANCED]: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  [PaymentStatus.COMPLETE]: "border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
};

// Roles that can see budget / payment data.
// Adjust the strings if your frontend Role enum uses different values.
const FINANCIAL_ROLES = ["SUPER_ADMIN", "ADMIN"];

// Roles that can edit a project
const EDIT_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

interface ProjectDetailsDialogProps {
  project: IProject | IDeveloperProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Role of the logged-in user (e.g. "ADMIN", "MANAGER", "DEVELOPER") */
  role?: string;
  /** Edit button is shown only when provided AND the role is allowed to edit */
  onEdit?: (project: IProject) => void;
}

function initials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function InfoItem({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-indigo-600/10 text-indigo-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-sm font-medium ${valueClassName ?? ""}`}>{value}</span>
      </div>
    </div>
  );
}

function LinkRow({
  icon: Icon,
  label,
  url,
}: {
  icon: React.ElementType;
  label: string;
  url?: string;
}) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </span>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
    </a>
  );
}

export function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
  role,
  onEdit,
}: ProjectDetailsDialogProps) {
  if (!project) return null;

  const canViewFinancials = !!role && FINANCIAL_ROLES.includes(role);
  const canEdit = !!role && EDIT_ROLES.includes(role) && !!onEdit;

  // Money-related and extra fields exist only on the full project shape
  const full = project as IProject;
  const client = project.client as any;

  const statusConfig =
    PROJECT_STATUS_CONFIG[project.status as IProject["status"]];

  const paymentStatus = full.paymentStatus;
  const totalPaid = (full.payments ?? [])
    .filter(
      (p) =>
        p.status === PaymentStatus.COMPLETE ||
        p.status === PaymentStatus.ADVANCED,
    )
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const amountDue =
    full.budget !== undefined && full.budget !== null
      ? Math.max(full.budget - totalPaid, 0)
      : undefined;

  const hasPaymentSection =
    canViewFinancials &&
    (!!paymentStatus ||
      !!full.nextPaymentDate ||
      (full.payments && full.payments.length > 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden bg-gray-100 p-0 dark:bg-slate-950">
        <div className="bg-linear-to-br from-indigo-600 to-cyan-700 px-6 py-5 text-white">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-indigo-100">
                  {TYPE_LABELS[project.type] ?? project.type}
                </span>
                <DialogTitle className="text-xl font-semibold text-white dark">
                  {project.name}
                </DialogTitle>

                <span className="text-sm text-indigo-100">
                  {getUserFullName(client)}
                </span>
                {client?.phone && (
                  <span className="text-sm text-indigo-100">{client.phone}</span>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Badge
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white"
                >
                  {statusConfig?.label ?? project.status}
                </Badge>
                {project.priority !== undefined && project.priority !== null && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-white/30 bg-white/10 text-white"
                  >
                    <Flag className="h-3 w-3" />
                    Priority {project.priority}
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[70vh]">
          <div className="flex flex-col gap-6 px-6 py-5">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {canViewFinancials && (
                <InfoItem icon={Wallet} label="Budget" value={formatCurrency(full.budget)} />
              )}
              <InfoItem
                icon={CalendarDays}
                label="Timeline"
                value={`${formatDate(project.startDate)} — ${
                  project.endDate ? formatDate(project.endDate) : "Ongoing"
                }`}
              />
            </section>

            <Separator />

            <section className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Team
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {initials(project.projectManager?.firstName, project.projectManager?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {getUserFullName(project.projectManager as any)}
                    </span>
                    <span className="text-xs text-muted-foreground">Project Leader</span>
                  </div>
                </div>

                {project.developers && project.developers.length > 0 && (
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2">
                      {project.developers.map((dev: any) => (
                        <Avatar
                          key={dev._id}
                          className="h-9 w-9 border-2 border-gray-100 dark:border-slate-950"
                          title={getUserFullName(dev)}
                        >
                          <AvatarFallback className="bg-cyan-700 text-white text-xs">
                            {initials(dev.firstName, dev.lastName)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {project.developers.length} Developer
                        {project.developers.length > 1 ? "s" : ""}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.developers
                          .map((dev: any) => getUserFullName(dev))
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {project.technologies?.length > 0 && (
              <>
                <Separator />
                <section className="flex flex-col gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </section>
              </>
            )}

            {(project.liveUrl || project.developmentLiveUrl || project.repositoryUrl) && (
              <>
                <Separator />
                <section className="flex flex-col gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Links
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <LinkRow icon={Rocket} label="Live Site" url={project.liveUrl} />
                    <LinkRow icon={Globe} label="Development Site" url={project.developmentLiveUrl} />
                    <LinkRow icon={Github} label="Repository" url={project.repositoryUrl} />
                  </div>
                </section>
              </>
            )}

            {project.description && (
              <>
                <Separator />
                <section className="flex flex-col gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </section>
              </>
            )}

            {full.documents && full.documents.length > 0 && (
              <>
                <Separator />
                <section className="flex flex-col gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Documents Access Credentials
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {full.documents.map((doc) => (
                      <LinkRow
                        key={doc._id ?? doc.link}
                        icon={FileText}
                        label={doc.requirement}
                        url={doc.link}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}

            {hasPaymentSection && (
              <>
                <Separator />
                <section className="flex flex-col gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Payment
                  </h3>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {paymentStatus && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <Badge
                          variant="outline"
                          className={`w-fit ${PAYMENT_STATUS_CLASSNAMES[paymentStatus]}`}
                        >
                          {PAYMENT_STATUS_LABELS[paymentStatus]}
                        </Badge>
                      </div>
                    )}
                    <InfoItem icon={CreditCard} label="Total Paid" value={formatCurrency(totalPaid)} />
                    <InfoItem
                      icon={Wallet}
                      label="Amount Due"
                      value={amountDue !== undefined ? formatCurrency(amountDue) : "—"}
                      valueClassName="text-red-600 dark:text-red-400"
                    />
                    {full.nextPaymentDate && (
                      <InfoItem
                        icon={CalendarDays}
                        label="Next Payment"
                        value={formatDate(full.nextPaymentDate)}
                      />
                    )}
                  </div>

                  {full.payments && full.payments.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground">History</span>
                      <div className="flex flex-col gap-2">
                        {full.payments.map((payment) => (
                          <div
                            key={payment._id ?? `${payment.date}-${payment.amount}`}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{formatCurrency(payment.amount)}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(payment.date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {typeof payment.financialAccountId === "object" &&
                                payment.financialAccountId
                                  ? (payment.financialAccountId as any).accountName
                                  : "No account"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${PAYMENT_STATUS_CLASSNAMES[payment.status]}`}
                              >
                                {PAYMENT_STATUS_LABELS[payment.status]}
                              </Badge>
                              {payment.note && (
                                <span className="text-xs text-muted-foreground">{payment.note}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {full.paymentSchedule && full.paymentSchedule.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground">Schedule</span>
                      <div className="flex flex-col gap-2">
                        {full.paymentSchedule.map((installment) => (
                          <div
                            key={installment._id ?? `${installment.installmentNo}-${installment.amount}`}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {installment.isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <span className="font-medium">{installment.installmentNo}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(installment.projectionDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {installment.paymentPercentage}%
                              </span>
                              <span className="font-medium">{formatCurrency(installment.amount)}</span>
                              <Badge
                                variant="outline"
                                className={
                                  installment.isCompleted
                                    ? "border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                    : "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                }
                              >
                                {installment.isCompleted ? "Completed" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}

            {full.createdAt && (
              <>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Created {formatDate(full.createdAt)} · Last updated {formatDate(full.updatedAt)}
                </p>
              </>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="flex items-center justify-end gap-2 border-t bg-gray-100 px-6 py-3 dark:bg-slate-950">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {canEdit && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit!(full);
              }}
              className="gap-2 bg-indigo-600 text-white hover:bg-cyan-800"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Project
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}