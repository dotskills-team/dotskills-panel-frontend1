"use client";

import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ILead } from "@/types/lead";

interface LeadsTrashRowActionsProps {
  lead: ILead;
  canPermanentlyDelete: boolean;
  onRestore: (lead: ILead) => void;
  onPermanentlyDelete: (lead: ILead) => void;
}

export function LeadsTrashRowActions({
  lead,
  canPermanentlyDelete,
  onRestore,
  onPermanentlyDelete,
}: LeadsTrashRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onRestore(lead)}>
          <RotateCcw className="h-4 w-4" />
          Restore Lead
        </DropdownMenuItem>
        {canPermanentlyDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onPermanentlyDelete(lead)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Permanently
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
