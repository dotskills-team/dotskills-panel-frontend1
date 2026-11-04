"use client";

import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useAdjustLeaveBalance,
  useCreateLeaveForStaff,
  useStaffLeaveBalance,
  useUpdateLeaveRequest,
} from "@/features/leave/hooks/use-leave";
import {
  adjustBalanceSchema,
  adminCreateSchema,
  adminEditSchema,
  type AdjustBalanceFormValues,
  type AdminCreateFormValues,
  type AdminEditFormValues,
} from "@/features/leave/schemas/leave.schema";
import { SINGLE_DAY_TYPES } from "@/features/leave/constants/leave.constant";
import type { ILeaveRequest } from "@/types/leave.types";
import { LeaveFields, StaffSelect } from "./leave-fields";
import { userName } from "./leave-badges";

const errMsg = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;
}

/** Drops empty strings so the API's optional fields stay optional. */
const clean = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)) as Partial<T>;

/* ------------------------- Add leave for staff ---------------------------- */

const createDefaults: AdminCreateFormValues = {
  staffId: "",
  leaveType: "casual",
  startDate: today(),
  endDate: "",
  halfDaySession: undefined,
  leaveTime: "",
  expectedArrivalTime: "",
  reason: "",
  emergencyContact: "",
  attachments: [],
  autoApprove: true,
  extraLeaveType: undefined,
  extraApprovalNote: "",
};

export function CreateForStaffDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateLeaveForStaff();
  const form = useForm<AdminCreateFormValues>({
    resolver: zodResolver(adminCreateSchema),
    defaultValues: createDefaults,
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (open) reset({ ...createDefaults, startDate: today() });
  }, [open, reset]);

  const autoApprove = useWatch({ control, name: "autoApprove" });

  const onSubmit = handleSubmit(async (values) => {
    const singleDay = SINGLE_DAY_TYPES.includes(values.leaveType);
    try {
      await create.mutateAsync(
        clean({
          ...values,
          endDate: singleDay ? undefined : values.endDate || values.startDate,
          // Extra-leave fields only matter when approving straight away.
          extraLeaveType: values.autoApprove ? values.extraLeaveType : undefined,
          extraApprovalNote: values.autoApprove ? values.extraApprovalNote : undefined,
        }),
      );
      toast.success(values.autoApprove ? "Leave added and approved" : "Leave request created");
      onOpenChange(false);
    } catch (e) {
      toast.error(errMsg(e, "Unable to add leave"));
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add leave for staff</DialogTitle>
          <DialogDescription>Past dates are allowed. The change is recorded in the audit log.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <Label>Staff member</Label>
            <Controller
              control={control}
              name="staffId"
              render={({ field }) => <StaffSelect value={field.value} onChange={field.onChange} />}
            />
            <FieldError message={errors.staffId?.message} />
          </div>

          <LeaveFields form={form} showDecision={autoApprove} />

          <Controller
            control={control}
            name="autoApprove"
            render={({ field }) => (
              <Label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                Approve immediately
              </Label>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending && <Loader2 className="animate-spin" />}
              Add leave
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------- Edit request ------------------------------- */

const toDay = (iso?: string) => (iso ? iso.slice(0, 10) : "");

export function EditRequestDialog({
  request,
  onOpenChange,
}: {
  request: ILeaveRequest | null;
  onOpenChange: (open: boolean) => void;
}) {
  const update = useUpdateLeaveRequest();
  const form = useForm<AdminEditFormValues>({ resolver: zodResolver(adminEditSchema) });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!request) return;
    reset({
      leaveType: request.leaveType,
      startDate: toDay(request.startDate),
      endDate: toDay(request.endDate),
      halfDaySession: request.halfDaySession,
      leaveTime: request.leaveTime ?? "",
      expectedArrivalTime: request.expectedArrivalTime ?? "",
      reason: request.reason ?? "",
      emergencyContact: request.emergencyContact ?? "",
      note: "",
      extraLeaveType: undefined,
      extraApprovalNote: "",
    });
  }, [request, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!request) return;
    const singleDay = SINGLE_DAY_TYPES.includes(values.leaveType);
    try {
      await update.mutateAsync({
        id: request._id,
        payload: clean({ ...values, endDate: singleDay ? undefined : values.endDate || values.startDate }),
      });
      toast.success("Request updated");
      onOpenChange(false);
    } catch (e) {
      toast.error(errMsg(e, "Unable to update request"));
    }
  });

  return (
    <Dialog open={Boolean(request)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit leave request</DialogTitle>
          <DialogDescription>
            {request
              ? `${userName(request.staff)}'s balance is recalculated and the edit is logged.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <LeaveFields form={form} showDecision={request?.status === "approved"} />
          <div>
            <Label htmlFor="edit-note">Note for the timeline (optional)</Label>
            <Textarea id="edit-note" rows={2} className="mt-1.5" {...register("note")} />
            <FieldError message={errors.note?.message} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------- Adjust balance ------------------------------- */

export function AdjustBalanceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const adjust = useAdjustLeaveBalance();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustBalanceFormValues>({
    resolver: zodResolver(adjustBalanceSchema),
    defaultValues: { staffId: "", field: "totalQuota", amount: undefined, reason: "" },
  });

  useEffect(() => {
    if (open) reset({ staffId: "", field: "totalQuota", amount: undefined, reason: "" });
  }, [open, reset]);

  const staffId = useWatch({ control, name: "staffId" });
  const balance = useStaffLeaveBalance(staffId || undefined);
  const b = balance.data?.data;

  const onSubmit = handleSubmit(async ({ staffId: id, ...payload }) => {
    try {
      await adjust.mutateAsync({ staffId: id, ...payload });
      toast.success("Balance adjusted");
      onOpenChange(false);
    } catch (e) {
      toast.error(errMsg(e, "Unable to adjust balance"));
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Adjust leave balance</DialogTitle>
            <DialogDescription>
              Add or remove days for the current year. Use a negative number to remove days.
            </DialogDescription>
          </DialogHeader>

          <div>
            <Label>Staff member</Label>
            <Controller
              control={control}
              name="staffId"
              render={({ field }) => <StaffSelect value={field.value} onChange={field.onChange} />}
            />
            <FieldError message={errors.staffId?.message} />
          </div>

          {staffId && (
            <p className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
              {balance.isLoading
                ? "Loading balance…"
                : b
                  ? `${b.year}: ${fmt(b.totalQuota + b.carriedForward)} total, ${fmt(b.used)} used, ${fmt(b.remaining)} remaining`
                  : "Unable to load balance."}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Adjust</Label>
              <Controller
                control={control}
                name="field"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="totalQuota">Yearly quota</SelectItem>
                      <SelectItem value="carriedForward">Carried forward</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="adj-amount">Days (+/−)</Label>
              <Input
                id="adj-amount"
                type="number"
                step="0.5"
                className="mt-1.5"
                {...register("amount", { valueAsNumber: true })}
              />
              <FieldError message={errors.amount?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="adj-reason">Reason (required)</Label>
            <Textarea id="adj-reason" rows={2} className="mt-1.5" {...register("reason")} />
            <FieldError message={errors.reason?.message} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={adjust.isPending}>
              {adjust.isPending && <Loader2 className="animate-spin" />}
              Apply
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
