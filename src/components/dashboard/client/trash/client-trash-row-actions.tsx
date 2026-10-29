"use client";

import { MoreHorizontal, RotateCcw, ShieldAlert, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { IClient } from "@/types/clients";

interface ClientTrashRowActionsProps {
  client: IClient;
  canPermanentlyDelete: boolean;
  onRestore: (client: IClient) => void;
  onPermanentlyDelete: (client: IClient) => void;
}

export function ClientTrashRowActions({
  client,
  canPermanentlyDelete,
  onRestore,
  onPermanentlyDelete,
}: ClientTrashRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-lg p-0 hover:bg-primary/8">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onRestore(client)} className="gap-2">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Restore client
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canPermanentlyDelete ? (
          <DropdownMenuItem
            onClick={() => onPermanentlyDelete(client)}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete permanently
          </DropdownMenuItem>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DropdownMenuItem
                  disabled
                  className="gap-2 text-muted-foreground"
                  onSelect={(event) => event.preventDefault()}
                >
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  Delete permanently
                </DropdownMenuItem>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              Only a Super Admin can permanently delete a client.
            </TooltipContent>
          </Tooltip>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
