import {
  CheckCircle2,
  FileText,
  MessageSquare,
  Paperclip,
  UserPlus,
} from "lucide-react";

import {
  formatDateTime,
  getLeadFullName,
} from "@/features/leads/utils/lead.utils";
import type { ILead } from "@/types/lead";

interface TimelineEvent {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  date?: string;
}

interface LeadTimelineProps {
  lead: ILead;
}

export function LeadTimeline({ lead }: LeadTimelineProps) {
  const events: TimelineEvent[] = [
    {
      id: "created",
      icon: <FileText className="h-4 w-4" />,
      title: "Lead created",
      description: lead.createdBy
        ? `by ${getLeadFullName(lead.createdBy)}`
        : undefined,
      date: lead.createdAt,
    },
    ...(lead.assignedTo
      ? [
          {
            id: "assigned",
            icon: <UserPlus className="h-4 w-4" />,
            title: "Lead assigned",
            description: `to ${getLeadFullName(lead.assignedTo)}`,
            date: lead.updatedAt,
          },
        ]
      : []),
    ...lead.notes.map((note) => ({
      id: note._id ?? note.createdAt ?? note.message,
      icon: <MessageSquare className="h-4 w-4" />,
      title: "Note added",
      description: note.createdBy
        ? `by ${getLeadFullName(note.createdBy)}`
        : note.message,
      date: note.createdAt,
    })),
    ...lead.attachments.map((attachment) => ({
      id: attachment._id ?? attachment.url,
      icon: <Paperclip className="h-4 w-4" />,
      title: "Attachment added",
      description: attachment.uploadedBy
        ? `by ${getLeadFullName(attachment.uploadedBy)}`
        : attachment.title,
      date: attachment.uploadedAt,
    })),
    ...(lead.isConverted
      ? [
          {
            id: "converted",
            icon: <CheckCircle2 className="h-4 w-4" />,
            title: "Converted to client",
            description: lead.convertedBy
              ? `by ${getLeadFullName(lead.convertedBy)}`
              : undefined,
            date: lead.convertedAt,
          },
        ]
      : []),
  ].sort(
    (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
  );

  if (events.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No activity yet.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-4">
      {events.map((event) => (
        <li key={event.id} className="flex gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {event.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{event.title}</span>
            {event.description && (
              <span className="text-sm text-muted-foreground">
                {event.description}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDateTime(event.date)}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
