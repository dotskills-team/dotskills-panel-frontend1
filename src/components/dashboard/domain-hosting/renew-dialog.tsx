"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addYears, format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_METHOD_OPTIONS,
} from "@/features/domain-hosting/constants/domain-hosting.constant";
import { useRenewTarget } from "@/features/domain-hosting/hooks/use-domain-hosting";
import {
  renewFormSchema,
  type RenewFormValues,
} from "@/features/domain-hosting/schemas/domain-hosting.schema";
import { toAmount, toDateInput, toIsoDate } from "@/features/domain-hosting/utils/domain-hosting.payload";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { ContactMethod, TargetType } from "@/types/domain-hosting.types";

interface RenewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TargetType;
  recordId: string;
  recordName: string;
  /** Current expiry, used to suggest the next expiry date (+1 year). */
  currentExpiry: string;
}

const suggestedNextExpiry = (currentExpiry: string) => {
  const base = new Date(currentExpiry);
  const next = addYears(Number.isNaN(base.getTime()) ? new Date() : base, 1);
  return format(next, "yyyy-MM-dd");
};

export function RenewDialog({
  open,
  onOpenChange,
  type,
  recordId,
  recordName,
  currentExpiry,
}: RenewDialogProps) {
  const form = useForm<RenewFormValues>({
    resolver: zodResolver(renewFormSchema),
    defaultValues: {
      newExpiryDate: "",
      status: "renewed",
      amountPaid: "",
      contactMethod: "",
      note: "",
    },
  });

  const renewMutation = useRenewTarget();

  useEffect(() => {
    if (open) {
      form.reset({
        newExpiryDate: suggestedNextExpiry(currentExpiry),
        status: "renewed",
        amountPaid: "",
        contactMethod: "",
        note: "",
      });
    }
  }, [open, currentExpiry, form]);

  const { errors } = form.formState;

  const onSubmit = async (values: RenewFormValues) => {
    try {
      await renewMutation.mutateAsync({
        type,
        id: recordId,
        payload: {
          newExpiryDate: toIsoDate(values.newExpiryDate) as string,
          status: values.status,
          amountPaid: toAmount(values.amountPaid),
          contactMethod: values.contactMethod ? (values.contactMethod as ContactMethod) : undefined,
          note: values.note.trim() || undefined,
        },
      });
      toast.success(`${recordName} renewed successfully.`);
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to record the renewal."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Renew {recordName}</DialogTitle>
          <DialogDescription>
            Current expiry: {currentExpiry ? toDateInput(currentExpiry) : "—"}. The renewal is saved in the history.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="renew-expiry">New expiry date *</Label>
            <Input id="renew-expiry" type="date" {...form.register("newExpiryDate")} />
            {errors.newExpiryDate && <p className="text-xs text-destructive">{errors.newExpiryDate.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="renew-amount">Amount paid</Label>
              <Input id="renew-amount" inputMode="decimal" placeholder="0" {...form.register("amountPaid")} />
              {errors.amountPaid && <p className="text-xs text-destructive">{errors.amountPaid.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="renew-status">Status after renewal</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="renew-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="renewed">Renewed</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="renew-method">How was it renewed?</Label>
            <Controller
              control={form.control}
              name="contactMethod"
              render={({ field }) => (
                <Select value={field.value || "none"} onValueChange={(value) => field.onChange(value === "none" ? "" : value)}>
                  <SelectTrigger id="renew-method" className="w-full">
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

          <div className="space-y-1.5">
            <Label htmlFor="renew-note">Note</Label>
            <Textarea id="renew-note" rows={2} {...form.register("note")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={renewMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={renewMutation.isPending}>
              {renewMutation.isPending ? "Saving..." : "Record renewal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
