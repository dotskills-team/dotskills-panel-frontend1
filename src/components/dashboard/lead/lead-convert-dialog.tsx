"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLeadMutations } from "@/features/leads/hooks";
import { getLeadFullName } from "@/features/leads/utils/lead.utils";
import type { ILead } from "@/types/lead";

interface LeadConvertDialogProps {
  lead: ILead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadConvertDialog({ lead, open, onOpenChange }: LeadConvertDialogProps) {
  const { convertLead } = useLeadMutations();

  if (!lead) return null;

  const handleConvert = () => {
    convertLead.mutate(
      { id: lead._id },
      {
        onSuccess: () => {
          toast.success(`${getLeadFullName(lead)} has been converted to a client.`);
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to convert lead."),
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Convert Lead to Client?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark <strong>{getLeadFullName(lead)}</strong> as won and
            converted. This action cannot be undone from here.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={convertLead.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={convertLead.isPending}
            onClick={(event) => {
              event.preventDefault();
              handleConvert();
            }}
          >
            {convertLead.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Convert
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
