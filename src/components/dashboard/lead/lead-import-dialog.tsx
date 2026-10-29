"use client";

import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiError } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useLeadMutations } from "@/features/leads/hooks";
import type { ImportLeadsSummary } from "@/features/leads/api/lead.api";

interface LeadImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_ROWS = 10_000;
const SAMPLE_TEMPLATE_PATH = "/templates/sample-leads.csv";

function getFileExtension(fileName: string) {
  const index = fileName.lastIndexOf(".");
  return index === -1 ? "" : fileName.slice(index).toLowerCase();
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function LeadImportDialog({ open, onOpenChange }: LeadImportDialogProps) {
  const { importLeads } = useLeadMutations();

  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [summary, setSummary] = useState<ImportLeadsSummary | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function resetState() {
    setFile(null);
    setIsDragActive(false);
    setSummary(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetState();
    onOpenChange(next);
  }

  function validateAndSetFile(candidate: File) {
    const extension = getFileExtension(candidate.name);

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      toast.error("Unsupported file type. Please upload a CSV, XLS or XLSX file.");
      return;
    }

    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    setSummary(null);
    setFile(candidate);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const candidate = event.target.files?.[0];
    if (candidate) validateAndSetFile(candidate);
    // Allow re-selecting the same file after removing it.
    event.target.value = "";
  }

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const candidate = event.dataTransfer.files?.[0];
    if (candidate) validateAndSetFile(candidate);
  }, []);

  function handleImport() {
    if (!file) {
      toast.error("Please select a file to import.");
      return;
    }

    importLeads.mutate(file, {
      onSuccess: (response) => {
        setSummary(response.data);
        setFile(null);
        toast.success(response.message || "Leads imported successfully.");
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? error.message
            : "Something went wrong while importing leads. Check your connection and try again.";
        toast.error(message);
      },
    });
  }

  function handleDownloadSample() {
    const link = document.createElement("a");
    link.href = SAMPLE_TEMPLATE_PATH;
    link.download = "sample-leads.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import leads</DialogTitle>
          <DialogDescription>
            Upload a spreadsheet to bulk-create leads. Rows with a duplicate phone
            number or email are skipped automatically.
          </DialogDescription>
        </DialogHeader>

        {summary ? (
          <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-sm font-medium text-foreground">
              Imported {summary.imported} of {summary.total} leads.
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {summary.duplicates > 0 && <li>{summary.duplicates} duplicate(s) skipped.</li>}
              {summary.failed > 0 && <li>{summary.failed} invalid row(s).</li>}
              {summary.duplicates === 0 && summary.failed === 0 && (
                <li>All rows imported successfully.</li>
              )}
            </ul>
          </div>
        ) : (
          <>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20",
              )}
            >
              {file ? (
                <div className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Drag & drop your file here
                    </p>
                    <p className="text-xs text-muted-foreground">or click below to browse</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                  >
                    Choose file
                  </Button>
                </>
              )}

              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS.join(",")}
                className="hidden"
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div className="rounded-md border border-border p-2 text-center">
                <p className="font-medium text-foreground">Formats</p>
                <p>CSV, XLS, XLSX</p>
              </div>
              <div className="rounded-md border border-border p-2 text-center">
                <p className="font-medium text-foreground">Max size</p>
                <p>10 MB</p>
              </div>
              <div className="rounded-md border border-border p-2 text-center">
                <p className="font-medium text-foreground">Max rows</p>
                <p>{MAX_ROWS.toLocaleString()}</p>
              </div>
            </div>

            <Button
              type="button"
              variant="link"
              className="h-auto justify-start gap-1.5 px-0 text-sm"
              onClick={handleDownloadSample}
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download sample CSV
            </Button>
          </>
        )}

        <DialogFooter>
          {summary ? (
            <Button onClick={() => handleOpenChange(false)}>Done</Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={importLeads.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleImport}
                disabled={!file || importLeads.isPending}
                className="gap-2"
              >
                {importLeads.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                Import Leads
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
