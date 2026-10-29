"use client";

import { useState } from "react";
import {
  ArrowRightLeft,
  Briefcase,
  History,
  Mail,
  MessageSquare,
  Paperclip,
  Phone,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  LEAD_PRIORITY_CONFIG,
  LEAD_SOURCE_CONFIG,
  LEAD_STATUS_CONFIG,
  LEAD_CONTACT_STATUS_OPTIONS,
} from "@/features/leads/constants/lead.constant";
import { useLead } from "@/features/leads/hooks";
import {
  canConvertLead,
  formatCurrency,
  formatDateTime,
  getInitials,
  getLeadFullName,
} from "@/features/leads/utils/lead.utils";
import { LeadAttachmentForm } from "./lead-attachment-form";
import { LeadAttachmentGallery } from "./lead-attachment-gallery";
import { LeadNoteForm } from "./lead-note-form";
import { LeadNotesList } from "./LeadNoteList";
import { LeadTimeline } from "./lead-timeline";
import type { ILead } from "@/types/lead";
import { cn } from "@/lib/utils";

interface LeadDetailsDrawerProps {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (lead: ILead) => void;
  onAssign: (lead: ILead) => void;
  onConvert: (lead: ILead) => void;
}

export function LeadDetailsDrawer({
  leadId,
  open,
  onOpenChange,
  onAssign,
  onConvert,
}: LeadDetailsDrawerProps) {
  const [tab, setTab] = useState("info");
  const { data, isLoading } = useLead(leadId ?? undefined, {
    enabled: open && Boolean(leadId),
  });

  const lead = data?.data;
  console.log(lead)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        {isLoading || !lead ? (
          <div className="flex flex-col gap-4 p-6">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <SheetHeader className="flex-row items-start justify-between gap-2 space-y-0 border-b bg-linear-to-br from-primary/5 via-transparent to-transparent px-4 pb-4 pt-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                    {getInitials(lead.firstName, lead.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <SheetTitle className="flex flex-wrap items-center gap-2 text-base">
                    <span className="truncate">{getLeadFullName(lead)}</span>
                    <Badge className={cn("text-[10px]", LEAD_STATUS_CONFIG[lead.status].className)}>
                      {LEAD_STATUS_CONFIG[lead.status].label}
                    </Badge>
                  </SheetTitle>
                  {lead.company && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      {lead.company}
                    </p>
                  )}
                </div>
              </div>
              {/* <Button variant="outline" size="sm" onClick={() => onEdit(lead)} className="shrink-0">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button> */}
            </SheetHeader>

            <Tabs value={tab} onValueChange={setTab} className="flex-1">
              <TabsList className="w-full justify-start gap-1 rounded-none border-b bg-muted/30 px-4">
                <TabsTrigger value="info" className="gap-1.5 data-[state=active]:text-primary">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Info</span>
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-1.5 data-[state=active]:text-amber-600">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Notes</span>
                  {lead.notes.length > 0 && (
                    <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
                      {lead.notes.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="attachments" className="gap-1.5 data-[state=active]:text-violet-600">
                  <Paperclip className="h-4 w-4" />
                  <span className="hidden sm:inline">Files</span>
                  {lead?.attachments?.length > 0 && (
                    <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
                      {lead?.attachments?.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-1.5 data-[state=active]:text-emerald-600">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Timeline</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => onAssign(lead)}>
                    <UserPlus className="h-4 w-4" />
                    {lead.assignedTo ? "Reassign" : "Assign"}
                  </Button>
                  {canConvertLead(lead) && (
                    <Button
                      size="sm"
                      onClick={() => onConvert(lead)}
                      className="gap-2 duration-500 hover:cursor-pointer hover:scale-105 transition-transform transform ease-in-out hover:bg-cyan-800 text-white bg-indigo-600"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      Convert to Client
                    </Button>
                  )}
                </div>

                <section className="flex flex-col gap-3 rounded-xl border bg-card p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <User className="h-4 w-4 text-primary" />
                    Lead Information
                  </h3>
                  <Separator />
                  <InfoRow label="Full Name" value={getLeadFullName(lead)} />
                  <InfoRow
                    label="Email"
                    value={
                      lead.email ? (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {lead.email}
                        </span>
                      ) : (
                        "-"
                      )
                    }
                  />
                  <InfoRow
                    label="Phone"
                    value={
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {lead.phone}
                      </span>
                    }
                  />
                  {
                    lead?.address ?
                      <InfoRow label="Address" value={lead.address} />
                      :
                      <InfoRow label="Location" value={lead.location || [lead.city, lead.state, lead.country].filter(Boolean).join(", ") || "-"} />
                  }
                  <InfoRow label="Company" value={lead.company || "-"} />
                  <InfoRow label="Source" value={LEAD_SOURCE_CONFIG[lead.source].label} />
                  <InfoRow
                    label="Status"
                    value={
                      <Badge className={LEAD_STATUS_CONFIG[lead.status].className}>
                        {LEAD_STATUS_CONFIG[lead.status].label}
                      </Badge>
                    }
                  />
                  <InfoRow
                    label="Contact Status"
                    value={LEAD_CONTACT_STATUS_OPTIONS.find((option) => option.value === lead.contactStatus)?.label || "—"}
                  />
                  <InfoRow label="Next Contact" value={lead.nextContactAt ? formatDateTime(lead.nextContactAt) : "—"} />
                  <InfoRow
                    label="Priority"
                    value={
                      <Badge className={LEAD_PRIORITY_CONFIG[lead.priority].className}>
                        {LEAD_PRIORITY_CONFIG[lead.priority].label}
                      </Badge>
                    }
                  />
                  <InfoRow
                    label="Last Update By"
                    value={lead.updatedBy ? lead.updatedBy.firstName : "Nobody updated"}
                  />
                  <InfoRow label="Created At" value={formatDateTime(lead.createdAt)} />
                  <InfoRow label="Last Updated" value={formatDateTime(lead.updatedAt)} />
                  {lead.estimatedValue ? (
                    <InfoRow
                      label="Estimated Value"
                      value={
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(lead.estimatedValue)}
                        </span>
                      }
                    />
                  ) : null}
                </section>

                {lead.requirementDescription && (
                  <section className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Requirement
                    </h3>
                    <Separator />
                    <p className="text-sm text-muted-foreground">
                      {lead.requirementDescription}
                    </p>
                  </section>
                )}

                {lead.tags.length > 0 && (
                  <section className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="notes" className="flex flex-col gap-4 p-4">
                <LeadNoteForm leadId={lead._id} />
                <LeadNotesList notes={lead.notes} />
              </TabsContent>

              <TabsContent value="attachments" className="flex flex-col gap-4 p-4">
                <LeadAttachmentForm leadId={lead._id} />
                <LeadAttachmentGallery attachments={lead.attachments} />
              </TabsContent>

              <TabsContent value="timeline" className="p-4">
                <LeadTimeline lead={lead} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
