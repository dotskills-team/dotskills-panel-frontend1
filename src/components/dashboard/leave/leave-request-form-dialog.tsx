"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Paperclip, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { leaveApi } from "@/features/leave/api/leave.api";
import { useCreateLeaveRequest, useLeavePreview } from "@/features/leave/hooks/use-leave";
import {
  leaveRequestSchema,
  type LeaveRequestFormValues,
} from "@/features/leave/schemas/leave.schema";
import {
  LEAVE_TYPE_OPTIONS,
  RECORD_ONLY_TYPES,
  SINGLE_DAY_TYPES,
} from "@/features/leave/constants/leave.constant";

const today = () => new Date().toISOString().slice(0, 10);

const emptyValues: LeaveRequestFormValues = {
  leaveType: "casual",
  startDate: today(),
  endDate: "",
  halfDaySession: undefined,
  leaveTime: "",
  expectedArrivalTime: "",
  reason: "",
  emergencyContact: "",
  attachments: [],
};

/** Delays a fast-changing value so the preview request is not fired on every keystroke. */
function useDebounced<T>(value: T, ms = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;
}

export function LeaveRequestFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateLeaveRequest();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) reset({ ...emptyValues, startDate: today() });
  }, [open, reset]);

  const values = useWatch({ control }) as LeaveRequestFormValues;
  const leaveType = values.leaveType;
  const singleDay = SINGLE_DAY_TYPES.includes(leaveType);
  const recordOnly = RECORD_ONLY_TYPES.includes(leaveType);

  // Live day count + over-balance warning come from the server so the rules stay in one place.
  const previewInput = useDebounced<LeaveRequestFormValues | null>(
    values.startDate
      ? {
          leaveType: values.leaveType,
          startDate: values.startDate,
          endDate: singleDay ? undefined : values.endDate || values.startDate,
          halfDaySession: values.halfDaySession,
          leaveTime: values.leaveTime || undefined,
          expectedArrivalTime: values.expectedArrivalTime || undefined,
          reason: values.reason || "preview",
          attachments: [],
        }
      : null,
  );
  const previewReady =
    open &&
    Boolean(previewInput) &&
    (leaveType !== "half_day" || Boolean(previewInput?.halfDaySession)) &&
    (leaveType !== "early_leave" || Boolean(previewInput?.leaveTime)) &&
    (leaveType !== "late_arrival" || Boolean(previewInput?.expectedArrivalTime));
  const preview = useLeavePreview(previewInput, previewReady);
  const previewData = preview.data?.data;
  const previewError = preview.error instanceof Error ? preview.error.message : null;

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const current = getValues("attachments");
    if (current.length + files.length > 5) {
      toast.error("You can attach up to 5 files");
      return;
    }
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of Array.from(files)) {
        const res = await leaveApi.uploadAttachment(file);
        uploaded.push(res.data);
      }
      setValue("attachments", [...current, ...uploaded], { shouldValidate: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await create.mutateAsync({
        ...data,
        endDate: singleDay ? undefined : data.endDate || data.startDate,
        leaveTime: data.leaveTime || undefined,
        expectedArrivalTime: data.expectedArrivalTime || undefined,
        emergencyContact: data.emergencyContact || undefined,
      });
      toast.success("Leave request submitted");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit request");
    }
  });

  const attachments = values.attachments ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New leave request</DialogTitle>
          <DialogDescription>
            You can apply even if your balance is used up. Extra days need admin approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <Label>Type</Label>
            <Controller
              control={control}
              name="leaveType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="startDate">{singleDay ? "Date" : "From"}</Label>
              <Input id="startDate" type="date" className="mt-1.5" {...register("startDate")} />
              <FieldError message={errors.startDate?.message} />
            </div>
            {!singleDay && (
              <div>
                <Label htmlFor="endDate">To</Label>
                <Input
                  id="endDate"
                  type="date"
                  className="mt-1.5"
                  min={values.startDate}
                  {...register("endDate")}
                />
                <FieldError message={errors.endDate?.message} />
              </div>
            )}
          </div>

          {leaveType === "half_day" && (
            <div>
              <Label>Session</Label>
              <Controller
                control={control}
                name="halfDaySession"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue placeholder="Morning or afternoon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.halfDaySession?.message} />
            </div>
          )}

          {leaveType === "early_leave" && (
            <div>
              <Label htmlFor="leaveTime">Leave time</Label>
              <Input id="leaveTime" type="time" className="mt-1.5" {...register("leaveTime")} />
              <FieldError message={errors.leaveTime?.message} />
            </div>
          )}

          {leaveType === "late_arrival" && (
            <div>
              <Label htmlFor="expectedArrivalTime">Expected arrival time</Label>
              <Input
                id="expectedArrivalTime"
                type="time"
                className="mt-1.5"
                {...register("expectedArrivalTime")}
              />
              <FieldError message={errors.expectedArrivalTime?.message} />
            </div>
          )}

          {/* Live day count and over-balance warning */}
          {previewError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {previewError}
            </div>
          ) : previewData ? (
            <div className="space-y-2">
              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                {recordOnly ? (
                  <span>This is a record only. It does not use your leave balance.</span>
                ) : (
                  <span>
                    <strong>{previewData.totalDays}</strong> day(s) requested ·{" "}
                    <strong>{previewData.paidDays}</strong> from balance
                    {previewData.extraDays > 0 && (
                      <>
                        {" "}
                        · <strong className="text-red-600">{previewData.extraDays}</strong> extra
                      </>
                    )}
                  </span>
                )}
              </div>
              {previewData.warning && (
                <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>{previewData.warning}</span>
                </div>
              )}
            </div>
          ) : preview.isFetching ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Calculating days…
            </div>
          ) : null}

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" rows={3} className="mt-1.5" {...register("reason")} />
            <FieldError message={errors.reason?.message} />
          </div>

          {leaveType === "emergency" && (
            <div>
              <Label htmlFor="emergencyContact">Emergency contact</Label>
              <Input
                id="emergencyContact"
                className="mt-1.5"
                placeholder="Name and phone number"
                {...register("emergencyContact")}
              />
            </div>
          )}

          {(leaveType === "sick" || leaveType === "emergency") && (
            <div>
              <Label>Supporting documents (e.g. medical certificate)</Label>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? <Loader2 className="animate-spin" /> : <Paperclip />}
                  Attach file
                </Button>
                {attachments.map((a, i) => (
                  <span
                    key={a.url}
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  >
                    <span className="max-w-40 truncate">{a.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${a.name}`}
                      onClick={() =>
                        setValue(
                          "attachments",
                          attachments.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending || uploading}>
              {create.isPending && <Loader2 className="animate-spin" />}
              Submit request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
