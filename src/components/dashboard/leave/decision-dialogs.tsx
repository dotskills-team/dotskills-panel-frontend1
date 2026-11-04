"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  useApproveLeaveRequest,
  useRecommendLeaveRequest,
  useRejectLeaveRequest,
} from "@/features/leave/hooks/use-leave";
import {
  extraApprovalSchema,
  recommendSchema,
  rejectSchema,
} from "@/features/leave/schemas/leave.schema";
import { EXTRA_LEAVE_OPTIONS } from "@/features/leave/constants/leave.constant";
import type { ILeaveRequest } from "@/types/leave.types";
import { userName } from "./leave-badges";

interface DialogProps {
  request: ILeaveRequest | null;
  onOpenChange: (open: boolean) => void;
}

const errMsg = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

/* ------------------------------ Reject ------------------------------------ */

export function RejectDialog({ request, onOpenChange }: DialogProps) {
  const reject = useRejectLeaveRequest();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof rejectSchema>>({ resolver: zodResolver(rejectSchema) });

  useEffect(() => reset({ reason: "" }), [request, reset]);

  const onSubmit = handleSubmit(async ({ reason }) => {
    if (!request) return;
    try {
      await reject.mutateAsync({ id: request._id, reason });
      toast.success("Request rejected");
      onOpenChange(false);
    } catch (e) {
      toast.error(errMsg(e, "Unable to reject request"));
    }
  });

  return (
    <Dialog open={Boolean(request)} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Reject request</DialogTitle>
            <DialogDescription>
              {request ? `${userName(request.staff)} will see this reason.` : ""}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea id="reject-reason" rows={3} className="mt-1.5" {...register("reason")} />
            {errors.reason && <p className="mt-1 text-xs text-destructive">{errors.reason.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Back
            </Button>
            <Button type="submit" variant="destructive" disabled={reject.isPending}>
              {reject.isPending && <Loader2 className="animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------- Extra-leave approval (admin) ----------------------- */

export function ExtraApprovalDialog({ request, onOpenChange }: DialogProps) {
  const approve = useApproveLeaveRequest();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof extraApprovalSchema>>({ resolver: zodResolver(extraApprovalSchema) });

  useEffect(() => reset({ extraLeaveType: undefined, extraApprovalNote: "" }), [request, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!request) return;
    try {
      await approve.mutateAsync({ id: request._id, payload: values });
      toast.success("Request approved");
      onOpenChange(false);
    } catch (e) {
      toast.error(errMsg(e, "Unable to approve request"));
    }
  });

  return (
    <Dialog open={Boolean(request)} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Approve extra leave</DialogTitle>
            <DialogDescription>
              {request
                ? `${userName(request.staff)} is asking for ${request.totalDays} day(s) with ${request.extraDays} over balance. Choose how the extra days are treated.`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <Controller
            control={control}
            name="extraLeaveType"
            render={({ field }) => (
              <RadioGroup value={field.value ?? ""} onValueChange={field.onChange} className="gap-2">
                {EXTRA_LEAVE_OPTIONS.map((o) => (
                  <Label
                    key={o.value}
                    htmlFor={`extra-${o.value}`}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-data-[state=checked]:border-indigo-500"
                  >
                    <RadioGroupItem id={`extra-${o.value}`} value={o.value} className="mt-0.5" />
                    <span>
                      <span className="block text-sm font-medium">{o.label}</span>
                      <span className="block text-xs font-normal text-muted-foreground">{o.hint}</span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            )}
          />
          {errors.extraLeaveType && (
            <p className="-mt-2 text-xs text-destructive">{errors.extraLeaveType.message}</p>
          )}

          <div>
            <Label htmlFor="extra-note">Comment (required)</Label>
            <Textarea id="extra-note" rows={3} className="mt-1.5" {...register("extraApprovalNote")} />
            {errors.extraApprovalNote && (
              <p className="mt-1 text-xs text-destructive">{errors.extraApprovalNote.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Back
            </Button>
            <Button type="submit" disabled={approve.isPending}>
              {approve.isPending && <Loader2 className="animate-spin" />}
              Approve
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------- Recommendation (manager) ------------------------- */

export function RecommendDialog({ request, onOpenChange }: DialogProps) {
  const recommend = useRecommendLeaveRequest();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof recommendSchema>>({ resolver: zodResolver(recommendSchema) });

  useEffect(() => reset({ note: "" }), [request, reset]);

  const onSubmit = handleSubmit(async ({ note }) => {
    if (!request) return;
    try {
      await recommend.mutateAsync({ id: request._id, note });
      toast.success("Recommendation sent to the admins");
      onOpenChange(false);
    } catch (e) {
      toast.error(errMsg(e, "Unable to add recommendation"));
    }
  });

  return (
    <Dialog open={Boolean(request)} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Add recommendation</DialogTitle>
            <DialogDescription>
              This request is over balance, so only an admin can decide it. Your comment helps them.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="rec-note">Comment</Label>
            <Textarea id="rec-note" rows={3} className="mt-1.5" {...register("note")} />
            {errors.note && <p className="mt-1 text-xs text-destructive">{errors.note.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Back
            </Button>
            <Button type="submit" disabled={recommend.isPending}>
              {recommend.isPending && <Loader2 className="animate-spin" />}
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
