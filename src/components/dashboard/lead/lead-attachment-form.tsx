/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRef, useState } from "react";
import {
  File as FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLeadMutations } from "@/features/leads/hooks";
import { inferAttachmentType } from "@/features/leads/utils/lead.utils";
import { AttachmentType } from "@/types/lead";
import { uploadFileToCloudinary } from "@/utils/cloudinary";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LeadAttachmentFormProps {
  leadId: string;
}

interface PendingUpload {
  id: string;
  file: File;
  previewUrl?: string;
  type: AttachmentType;
  status: "uploading" | "error";
}

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

export function LeadAttachmentForm({ leadId }: LeadAttachmentFormProps) {
  const { addAttachment } = useLeadMutations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    const entries: PendingUpload[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      type: inferAttachmentType(file),
      status: "uploading",
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setPending((prev) => [...prev, ...entries]);

    for (const entry of entries) {
      try {
        const resourceType =
          entry.type === AttachmentType.IMAGE ? "image" : "auto";
        const url = await uploadFileToCloudinary(entry.file, resourceType);

        await addAttachment.mutateAsync({
          id: leadId,
          payload: {
            title: entry.file.name,
            url,
            type: entry.type,
          },
        });

        toast.success(`${entry.file.name} attached.`);
      } catch (error) {
        setPending((prev) =>
          prev.map((item) =>
            item.id === entry.id ? { ...item, status: "error" } : item,
          ),
        );
        toast.error(`Failed to attach ${entry.file.name}.`);
        continue;
      }

      setPending((prev) => {
        const removed = prev.find((item) => item.id === entry.id);
        if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
        return prev.filter((item) => item.id !== entry.id);
      });
    }
  };

  const removePending = (id: string) => {
    setPending((prev) => {
      const removed = prev.find((item) => item.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) void processFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) void processFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
        )}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag & drop files, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Images, PDFs, docs, and spreadsheets
        </p>
      </div>

      {pending.length > 0 && (
        <ul className="flex flex-col gap-2">
          {pending.map((item) => {
            const { icon: Icon, classes } = TYPE_STYLES[item.type];
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border bg-background p-2"
              >
                {item.previewUrl ? (
                  <Image
                    width={300}
                    height={300}
                    priority
                    quality={90}
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-10 w-10 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
                      classes,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.status === "uploading"
                      ? "Uploading…"
                      : "Failed to upload"}
                  </p>
                </div>
                {item.status === "uploading" ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => removePending(item.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
