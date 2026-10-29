"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addClientNoteSchema } from "@/features/clients/schemas/client.schema";
import type { AddClientNoteValues } from "@/features/clients/schemas/client.schema";
import { Loader } from "lucide-react";

interface ClientNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddClientNoteValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function ClientNoteDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: ClientNoteDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddClientNoteValues>({
    resolver: zodResolver(addClientNoteSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleFormSubmit = async (data: AddClientNoteValues) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="note-message">Note</Label>
            <Textarea
              id="note-message"
              placeholder="Write your note here..."
              className="min-h-32 resize-none"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2 hover:cursor-pointer hover:scale-105 transition-transform duration-500 transform ease-in-out hover:bg-teal-800 text-white bg-indigo-600">
              {isSubmitting && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}