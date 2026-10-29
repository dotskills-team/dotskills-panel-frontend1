/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_CONTACT_STATUS_OPTIONS } from "@/features/leads/constants/lead.constant";
import { useLeadMutations } from "@/features/leads/hooks";
import { formatNextContact } from "@/features/leads/utils/lead.utils";
import { LeadContactStatus, type ILead } from "@/types/lead";

interface LeadContactStatusDialogProps {
  lead: ILead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadContactStatusDialog({
  lead,
  open,
  onOpenChange,
}: LeadContactStatusDialogProps) {
  const { updateContactStatus } = useLeadMutations();
  const [status, setStatus] = useState<LeadContactStatus>(LeadContactStatus.NO_RESPONSE);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !lead) return;
    setStatus(lead.contactStatus ?? LeadContactStatus.NO_RESPONSE);
    const nextDate = lead.nextContactAt ? new Date(lead.nextContactAt) : null;
    setDate(nextDate ? nextDate.toISOString().slice(0, 10) : "");
    setTime(nextDate ? nextDate.toTimeString().slice(0, 5) : "");
    setError(null);
  }, [open, lead]);

  const isSubmitting = updateContactStatus.isPending;
  const handleSubmit = () => {
    if (!lead) return;
    setError(null);
    let nextContactAt: string | undefined;

    if (status === LeadContactStatus.NEXT_CONTACT) {
      if (!date || !time) {
        setError("Choose both a date and time for the next contact.");
        return;
      }
      const selected = new Date(`${date}T${time}`);
      if (Number.isNaN(selected.getTime())) {
        setError("Enter a valid date and time.");
        return;
      }
      if (selected.getTime() <= Date.now()) {
        setError("Next contact must be scheduled in the future.");
        return;
      }
      nextContactAt = selected.toISOString();
    }

    updateContactStatus.mutate(
      { id: lead._id, payload: { contactStatus: status, ...(nextContactAt ? { nextContactAt } : {}) } },
      {
        onSuccess: () => {
          toast.success("Contact status updated.");
          onOpenChange(false);
        },
        onError: () => {
          setError("We could not save this contact status. Please try again.");
          toast.error("Failed to update contact status.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-100 dark:bg-slate-950">
        <DialogHeader>
          <DialogTitle>Update contact status</DialogTitle>
          <DialogDescription>
            Track the latest outreach outcome for {lead?.firstName ?? "this lead"}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-status">Contact status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as LeadContactStatus)}>
              <SelectTrigger id="contact-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LEAD_CONTACT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {status === LeadContactStatus.NEXT_CONTACT && (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium"><CalendarClock className="size-4 text-primary" /> Schedule next contact</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2"><Label htmlFor="next-contact-date">Date</Label><Input id="next-contact-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div>
                <div className="flex flex-col gap-2"><Label htmlFor="next-contact-time">Time</Label><Input id="next-contact-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} /></div>
              </div>
              {lead?.nextContactAt && <p className="text-xs text-muted-foreground">Currently scheduled for {formatNextContact(lead.nextContactAt)}.</p>}
            </div>
          )}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button type="button" variant={"default"} onClick={handleSubmit} disabled={isSubmitting} className="gap-2 duration-500 hover:cursor-pointer hover:scale-105 transition-transform transform ease-in-out hover:bg-cyan-800 text-white bg-indigo-600">
            {isSubmitting && <Loader2 className="animate-spin" data-icon="inline-start" />}
            Save status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}