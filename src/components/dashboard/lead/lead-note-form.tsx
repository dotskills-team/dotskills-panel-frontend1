"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLeadMutations } from "@/features/leads/hooks";
import { addNoteSchema, type AddNoteValues } from "@/features/leads/schemas/lead.schema";

interface LeadNoteFormProps {
  leadId: string;
}

export function LeadNoteForm({ leadId }: LeadNoteFormProps) {
  const { addNote } = useLeadMutations();

  const form = useForm<AddNoteValues>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    addNote.mutate(
      { id: leadId, payload: values },
      {
        onSuccess: () => {
          form.reset();
          toast.success("Note added.");
        },
        onError: () => toast.error("Failed to add note."),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <Textarea
        rows={3}
        placeholder="Add a note about this lead..."
        {...form.register("message")}
      />
      {form.formState.errors.message && (
        <span className="text-xs text-destructive">
          {form.formState.errors.message.message}
        </span>
      )}
      <Button type="submit" size="sm" className="self-end" disabled={addNote.isPending}>
        {addNote.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Add Note
      </Button>
    </form>
  );
}
