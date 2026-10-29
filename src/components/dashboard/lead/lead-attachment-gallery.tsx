"use client";

import {
  File as FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  Download,
} from "lucide-react";

import {
  getLeadFullName,
  formatRelativeTime,
} from "@/features/leads/utils/lead.utils";
import { AttachmentType, type ILeadAttachment } from "@/types/lead";
import { cn } from "@/lib/utils";
import Image from "next/image";

const TYPE_STYLES: Record<
  AttachmentType,
  { icon: typeof FileIcon; classes: string }
> = {
  [AttachmentType.IMAGE]: {
    icon: FileImage,
    classes: "bg-blue-500/10 text-blue-600",
  },
  [AttachmentType.PDF]: {
    icon: FileText,
    classes: "bg-red-500/10 text-red-600",
  },
  [AttachmentType.SPREADSHEET]: {
    icon: FileSpreadsheet,
    classes: "bg-emerald-500/10 text-emerald-600",
  },
  [AttachmentType.DOCUMENT]: {
    icon: FileType,
    classes: "bg-indigo-500/10 text-indigo-600",
  },
  [AttachmentType.OTHER]: {
    icon: FileIcon,
    classes: "bg-slate-500/10 text-slate-600",
  },
};

export function LeadAttachmentGallery({
  attachments,
}: {
  attachments: ILeadAttachment[];
}) {
  if (!attachments.length) {
    return <p className="text-sm text-muted-foreground">No attachments yet.</p>;
  }

  const sorted = [...attachments].sort(
    (a, b) =>
      new Date(b.uploadedAt ?? 0).getTime() -
      new Date(a.uploadedAt ?? 0).getTime(),
  );

  return (
    <ul className="grid grid-cols-1 gap-3">
      {sorted.map((attachment, index) => {
        const { icon: Icon, classes } =
          TYPE_STYLES[attachment.type] ?? TYPE_STYLES[AttachmentType.OTHER];
        const isImage = attachment.type === AttachmentType.IMAGE;

        return (
          <li
            key={attachment._id ?? attachment.url}
            className="group flex items-center gap-3 rounded-xl border bg-background p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              {isImage ? (
                <Image
                  width={300}
                  height={300}
                  priority
                  quality={90}
                  src={attachment.url}
                  alt={attachment.title}
                  className="h-12 w-12 rounded-lg object-cover ring-1 ring-black/5"
                />
              ) : (
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg",
                    classes,
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
              )}
            </a>

            <div className="min-w-0 flex-1">
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm font-medium hover:underline"
              >
                {attachment.title}
              </a>
              <p className="truncate text-xs text-muted-foreground">
                {index === 0 && "Latest · "}
                {attachment.uploadedBy
                  ? getLeadFullName(attachment.uploadedBy)
                  : "Unknown"}{" "}
                · {formatRelativeTime(attachment.uploadedAt)}
              </p>
            </div>

            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
            >
              <Download className="h-4 w-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
