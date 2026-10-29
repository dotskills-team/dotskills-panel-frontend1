import type { IClientNote } from "@/types/clients";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ClientTimelineProps {
  notes: IClientNote[];
  className?: string;
}

export function ClientTimeline({
  notes,
  className,
}: ClientTimelineProps) {
  if (!notes.length) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No notes yet. Add a note to start.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {notes.map((note, index) => (
        <div key={note._id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://avatar.vercel.sh/${note.createdBy?.email}`}
              />
              <AvatarFallback>
                {note.createdBy?.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {index < notes.length - 1 && (
              <div className="w-0.5 h-12 bg-border my-2" />
            )}
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                {note.createdBy?.firstName} {note.createdBy?.lastName}
              </p>
              <span className="text-xs text-muted-foreground">
                {format(new Date(note.createdAt), "MMM dd, yyyy HH:mm")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {note.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
