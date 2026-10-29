"use client";

import {
  ArrowRightLeft,
  Check,
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  CalendarClock,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { canConvertLead } from "@/features/leads/utils/lead.utils";
import type { ILead, LeadStatus } from "@/types/lead";

import { LEAD_STATUS_OPTIONS } from "@/features/leads/constants/lead.constant";

interface LeadRowActionsProps {
  lead: ILead;
  onOpenDetails: (lead: ILead) => void;
  onEdit: (lead: ILead) => void; 
  onAssign: (lead: ILead) => void;
  onConvert: (lead: ILead) => void;
  onDelete: (lead: ILead) => void;
  onUpdateStatus: (lead: ILead, status: LeadStatus) => void;
  onUpdateContactStatus: (lead: ILead) => void;
}

export function LeadRowActions({
  lead,
  onOpenDetails,
  onEdit,
  onAssign,
  onUpdateStatus,
  onUpdateContactStatus,
  onConvert,
  onDelete,
}: LeadRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem onClick={() => onOpenDetails(lead)}>
          <Eye className="h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(lead)}>
          <Pencil className="h-4 w-4" />
          Edit Lead
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAssign(lead)}>
          <UserPlus className="h-4 w-4" />
          Assign
        </DropdownMenuItem>
        {canConvertLead(lead) && (
          <DropdownMenuItem onClick={() => onConvert(lead)}>
            <ArrowRightLeft className="h-4 w-4" />
            Convert to Client
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onUpdateContactStatus(lead)}>
          <CalendarClock className="h-4 w-4" />
          Contact Status
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <RefreshCw className="mr-2 h-4 w-4" />
            Update Status
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            {LEAD_STATUS_OPTIONS.map((item) => (
              <DropdownMenuItem
                key={item.value}
                disabled={lead.status === item.value}
                onClick={() => onUpdateStatus(lead, item.value)}
              >
                {lead.status === item.value && (
                  <Check className="mr-2 h-4 w-4" />
                )}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(lead)}>
          <Trash2 className="h-4 w-4" />
          Move to Trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
