"use client";

import { getLeadFullName, formatRelativeTime } from "@/features/leads/utils/lead.utils";
import type { ILeadNote } from "@/types/lead";

export function LeadNotesList({ notes }: { notes: ILeadNote[] }) {
  if (!notes.length) {
    return <p className="text-sm text-muted-foreground">No notes yet.</p>;
  }

  const sorted = [...notes].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
  );

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((note, index) => (
        <li key={note._id ?? `${note.createdAt}-${index}`} className="rounded-lg border p-3">
          <p className="text-sm">{note.message}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {index === 0 && "Latest · "}
            {getLeadFullName(note.createdBy)} · {formatRelativeTime(note.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}