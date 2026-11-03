"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_METHOD_OPTIONS,
  LOG_ACTION_OPTIONS,
} from "@/features/domain-hosting/constants/domain-hosting.constant";
import { useAddTargetLog } from "@/features/domain-hosting/hooks/use-domain-hosting";
import {
  logFormSchema,
  type LogFormValues,
} from "@/features/domain-hosting/schemas/domain-hosting.schema";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { ContactMethod, TargetType } from "@/types/domain-hosting.types";

interface LogContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TargetType;
  recordId: string;
  recordName: string;
}

const EMPTY_VALUES: LogFormValues = {
  action: "client_contacted",
  contactMethod: "",
  note: "",
};

export function LogContactDialog({
  open,
  onOpenChange,
  type,
  recordId,
  recordName,
}: LogContactDialogProps) {
  const form = useForm<LogFormValues>({
    resolver: zodResolver(logFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  const addLogMutation = useAddTargetLog();

  useEffect(() => {
    if (open) form.reset(EMPTY_VALUES);
  }, [open, form]);

  const { errors } = form.formState;

  const onSubmit = async (values: LogFormValues) => {
    try {
      await addLogMutation.mutateAsync({
        type,
        id: recordId,
        payload: {
          action: values.action,
          contactMethod: values.contactMethod ? (values.contactMethod as ContactMethod) : undefined,
          note: values.note.trim() || undefined,
        },
      });
      toast.success("Entry added to the history.");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to add the entry."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log client contact</DialogTitle>
          <DialogDescription>{recordName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="log-action">Type</Label>
              <Controller
                control={form.control}
                name="action"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="log-action" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOG_ACTION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.action && <p className="text-xs text-destructive">{errors.action.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="log-method">Method</Label>
              <Controller
                control={form.control}
                name="contactMethod"
                render={({ field }) => (
                  <Select value={field.value || "none"} onValueChange={(value) => field.onChange(value === "none" ? "" : value)}>
                    <SelectTrigger id="log-method" className="w-full">
                      <SelectValue placeholder="Not specified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      {CONTACT_METHOD_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="log-note">Note</Label>
            <Textarea id="log-note" rows={4} placeholder="What did the client say?" {...form.register("note")} />
            {errors.note && <p className="text-xs text-destructive">{errors.note.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={addLogMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={addLogMutation.isPending}>
              {addLogMutation.isPending ? "Saving..." : "Save entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
