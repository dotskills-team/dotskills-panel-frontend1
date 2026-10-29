"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  assignClientManagerSchema,
  type AssignClientManagerValues,
} from "@/features/clients/schemas/client.schema";

interface ClientAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  managers: Array<{
    _id: string;
    firstName: string;
    lastName: string;
  }>;
  onSubmit: (data: AssignClientManagerValues) => Promise<void>;
  isSubmitting?: boolean;
  currentManager?: string;
}

export function ClientAssignDialog({
  open,
  onOpenChange,
  managers,
  onSubmit,
  isSubmitting,
  currentManager,
}: ClientAssignDialogProps) {
  const form = useForm<AssignClientManagerValues>({
    resolver: zodResolver(assignClientManagerSchema),
    defaultValues: {
      accountManager: currentManager ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        accountManager: currentManager ?? "",
      });
    }
  }, [open, currentManager, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Manager</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Select Manager</Label>

            <Select
              value={form.watch("accountManager")}
              onValueChange={(value) =>
                form.setValue("accountManager", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a manager" />
              </SelectTrigger>

              <SelectContent>
                {managers.map((manager) => (
                  <SelectItem
                    key={manager._id}
                    value={manager._id}
                  >
                    {manager.firstName} {manager.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {form.formState.errors.accountManager && (
              <p className="text-xs text-destructive">
                {form.formState.errors.accountManager.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 hover:cursor-pointer hover:scale-105 transition-transform duration-500 transform ease-in-out hover:bg-indigo-800 text-white bg-teal-600"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Assign Manager
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}