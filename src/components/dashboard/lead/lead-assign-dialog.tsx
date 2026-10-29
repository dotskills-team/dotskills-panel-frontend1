"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import { getLeadFullName } from "@/features/leads/utils/lead.utils";
import { useLeadMutations } from "@/features/leads/hooks";
import type { ILead } from "@/types/lead";

interface LeadAssignDialogProps {
  lead: ILead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadAssignDialog({ lead, open, onOpenChange }: LeadAssignDialogProps) {
  const { assignLead } = useLeadMutations();
  const { data } = useAssignableUsers();
  const users = data?.data ?? [];

  const [selected, setSelected] = useState<string>(lead?.assignedTo?._id ?? "");

  if (!lead) return null;

  const handleAssign = () => {
    if (!selected) {
      toast.error("Please choose a team member.");
      return;
    }

    assignLead.mutate(
      { id: lead._id, payload: { assignedTo: selected } },
      {
        onSuccess: () => {
          toast.success("Lead assigned successfully.");
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to assign lead."),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Lead</DialogTitle>
          <DialogDescription>
            Choose a team member to own {lead.firstName} {lead.lastName}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label>Team Member</Label>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Select a team member" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {getLeadFullName(user)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={assignLead.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={assignLead.isPending}>
            {assignLead.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
