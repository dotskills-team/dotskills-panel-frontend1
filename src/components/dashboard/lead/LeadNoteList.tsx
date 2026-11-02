"use client";

import { useState } from "react";
import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLeadMutations } from "@/features/leads/hooks";
import { addNoteSchema } from "@/features/leads/schemas/lead.schema";
import { getLeadFullName, formatRelativeTime } from "@/features/leads/utils/lead.utils";
import type { ILeadNote } from "@/types/lead";

interface LeadNotesListProps {
  leadId: string;
  notes: ILeadNote[];
}

export function LeadNotesList({ leadId, notes }: LeadNotesListProps) {
  const { updateNote, deleteNote } = useLeadMutations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!notes.length) {
    return <p className="text-sm text-muted-foreground">No notes yet.</p>;
  }

  const sorted = [...notes].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
  );

  const startEdit = (note: ILeadNote) => {
    setEditingId(note._id ?? null);
    setDraft(note.message);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
    setError(null);
  };

  const saveEdit = (noteId: string) => {
    const parsed = addNoteSchema.safeParse({ message: draft });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid note.");
      return;
    }

    updateNote.mutate(
      { id: leadId, noteId, payload: parsed.data },
      {
        onSuccess: () => {
          cancelEdit();
          toast.success("Note updated.");
        },
        onError: () => toast.error("Failed to update note."),
      },
    );
  };

  const confirmDelete = () => {
    if (!deletingId) return;

    deleteNote.mutate(
      { id: leadId, noteId: deletingId },
      {
        onSuccess: () => toast.success("Note deleted."),
        onError: () => toast.error("Failed to delete note."),
        onSettled: () => setDeletingId(null),
      },
    );
  };

  return (
    <>
      <ul className="flex flex-col gap-3">
        {sorted.map((note, index) => {
          const isEditing = !!note._id && editingId === note._id;

          return (
            <li key={note._id ?? `${note.createdAt}-${index}`} className="rounded-lg border p-3">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <Textarea
                    rows={3}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoFocus
                  />
                  {error && <span className="text-xs text-destructive">{error}</span>}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={updateNote.isPending}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => saveEdit(note._id!)}
                      disabled={updateNote.isPending}
                    >
                      {updateNote.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm whitespace-pre-wrap break-words">{note.message}</p>
                    {note._id && (
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => startEdit(note)}
                          aria-label="Edit note"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => setDeletingId(note._id!)}
                          aria-label="Delete note"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {index === 0 && "Latest · "}
                    {getLeadFullName(note.createdBy)} · {formatRelativeTime(note.createdAt)}
                  </p>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && !deleteNote.isPending && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteNote.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteNote.isPending}
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              {deleteNote.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
