import { Button } from "@/components/ui/button";
import type { IClientDocument } from "@/types/clients";
import {
  FileIcon,
  FileText,
  Image,
  Sheet,
  Download,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DocumentItemProps {
  document: IClientDocument;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const typeIcons = {
  IMAGE: Image,
  PDF: FileText,
  DOCUMENT: FileIcon,
  SPREADSHEET: Sheet,
  OTHER: FileIcon,
};

export function DocumentItem({
  document,
  onDelete,
  isDeleting,
}: DocumentItemProps) {
  const Icon = typeIcons[document.type] || FileIcon;

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{document.title}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(document.createdAt), "MMM dd, yyyy")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-8 w-8 p-0"
        >
          <a href={document.url} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
          </a>
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(document._id)}
            disabled={isDeleting}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
