"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Globe, Linkedin, Mail, Megaphone, Phone, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LEAD_PRIORITY_CONFIG,
  LEAD_SOURCE_CONFIG,
  LEAD_STATUS_CONFIG,
  LEAD_TYPE_CONFIG,
} from "@/features/leads/constants/lead.constant";
import { formatDate, formatRelativeTime, getInitials, getLeadFullName } from "@/features/leads/utils/lead.utils";
import { LeadRowActions } from "./lead-row-actions";
import { ILead, LeadSource } from "@/types/lead";

const SOURCE_ICONS: Record<LeadSource, React.ReactNode> = {
  [LeadSource.WEBSITE]: <Globe className="h-3.5 w-3.5" />,
  [LeadSource.FACEBOOK]: <Users className="h-3.5 w-3.5" />,
  [LeadSource.GOOGLE]: <Globe className="h-3.5 w-3.5" />,
  [LeadSource.LINKEDIN]: <Linkedin className="h-3.5 w-3.5" />,
  [LeadSource.WHATSAPP]: <Phone className="h-3.5 w-3.5" />,
  [LeadSource.EMAIL]: <Mail className="h-3.5 w-3.5" />,
  [LeadSource.PHONE_CALL]: <Phone className="h-3.5 w-3.5" />,
  [LeadSource.REFERRAL]: <Megaphone className="h-3.5 w-3.5" />,
  [LeadSource.MANUAL]: <Users className="h-3.5 w-3.5" />,
  [LeadSource.OTHER]: <Users className="h-3.5 w-3.5" />,
};

interface LeadsTableColumnsOptions {
  onOpenDetails: (lead: ILead) => void;
  onEdit: (lead: ILead) => void;
   onUpdateStatus: (lead: ILead, status: import("@/types/lead").LeadStatus) => void;
  onUpdateContactStatus: (lead: ILead) => void;
  onAssign: (lead: ILead) => void;
  onConvert: (lead: ILead) => void;
  onDelete: (lead: ILead) => void;
}

export function getLeadsTableColumns({
  onOpenDetails,
  onEdit,
  onUpdateStatus,
  onUpdateContactStatus,
  onAssign,
  onConvert,
  onDelete,
}: LeadsTableColumnsOptions): ColumnDef<ILead>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(Boolean(value))
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          onClick={(event) => event.stopPropagation()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "lead",
      id: "lead",
      header: "Lead",
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <button
            type="button"
            onClick={() => onOpenDetails(lead)}
            className="flex items-center gap-3 text-left"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {getInitials(lead.firstName, lead.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{getLeadFullName(lead)}</span>
              <span className="text-xs text-muted-foreground">
                {/* {lead.email || lead.phone} */}
              </span>
              <span className="text-xs text-muted-foreground">
                {lead.phone}
              </span>
            </div>
          </button>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const config = LEAD_STATUS_CONFIG[row.original.status];
        return (
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contactStatus",
      header: "Contact Status",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.contactStatus === "NO_RESPONSE" ? "No Response" : row.original.contactStatus === "BUSY" ? "Busy" : row.original.contactStatus === "NEXT_CONTACT" ? "Next Contact" : row.original.contactStatus === "PHONE_OFF" ? "Phone Off" : "—"}
        </Badge>
      ),
    },
    {
      accessorKey: "nextContactAt",
      header: "Next Contact",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.nextContactAt ? formatDate(row.original.nextContactAt) : "—"}</span>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.location || [row.original.city, row.original.state].filter(Boolean).join(", ") || "—"}</span>,
    },
    {
      accessorKey: "leadType",
      header: "Type",
      cell: ({ row }) => {
        const config = LEAD_TYPE_CONFIG[row?.original?.leadType || "WEBSITE"];
        return (
          <Badge variant="outline" className={config.label === "Website" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : config.label === "Software" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : ""}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => {
        const config = LEAD_SOURCE_CONFIG[row.original.source];
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {SOURCE_ICONS[row.original.source]}
            {config.label}
          </div>
        );
      },
    },
    {
      accessorKey: "assignedTo",
      header: "UpdatedBy",
      cell: ({ row }) => {
        const updatedBy = row.original.updatedBy;
        if (!updatedBy) {
          return <span className="text-sm text-muted-foreground">No body updated</span>;
        }
        return (
          <div className="flex items-center gap-2">
            {/* <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">
                {getInitials(assignee.firstName, assignee.lastName)}
              </AvatarFallback>
            </Avatar> */}
            <span className="text-sm">{updatedBy.firstName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.updatedAt)}
        </span>
      ),
    },
    {
  id: "lastNote",
  header: "Last Note",
  cell: ({ row }) => {
    const notes = row.original.notes ?? [];
    const last = notes[notes.length - 1];
    return (
      <span className="text-sm text-muted-foreground">
        {last?.createdAt ? formatRelativeTime(last.createdAt) : "—"}
      </span>
    );
  },
},
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <LeadRowActions
          lead={row.original}
          onOpenDetails={onOpenDetails}
          onEdit={onEdit}
          onAssign={onAssign}
          onUpdateStatus={onUpdateStatus}
          onUpdateContactStatus={onUpdateContactStatus}
          onConvert={onConvert}
          onDelete={onDelete}
        />
      ),
    },
    
  ];
}