/* eslint-disable react-hooks/incompatible-library */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addClientDocumentSchema } from "@/features/clients/schemas/client.schema";
import { CLIENT_DOCUMENT_TYPE_OPTIONS } from "@/features/clients/constants/client.constant";
import type { AddClientDocumentValues } from "@/features/clients/schemas/client.schema";
import { Loader, Upload } from "lucide-react";
import { useState } from "react";

interface ClientDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddClientDocumentValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function ClientDocumentDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: ClientDocumentDialogProps) {
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddClientDocumentValues>({
    resolver: zodResolver(addClientDocumentSchema),
    defaultValues: {
      title: "",
      url: "",
      type: undefined,
    },
  });

  const watchedType = watch("type");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setValue("title", file.name, { shouldValidate: true });
    }
  };

  const handleFormSubmit = async (data: AddClientDocumentValues) => {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/50"
            }`}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Drag files here or</p>
            <p className="text-xs text-muted-foreground">click to select</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-title">Document Title</Label>
            <Input
              id="doc-title"
              placeholder="e.g., Project Proposal"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-url">Document URL</Label>
            <Input
              id="doc-url"
              placeholder="https://example.com/document.pdf"
              {...register("url")}
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Document Type (Optional)</Label>
            <Select
              value={watchedType}
              onValueChange={(v) =>
                setValue("type", v as AddClientDocumentValues["type"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CLIENT_DOCUMENT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">
                {errors.type.message as string}
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
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}