"use client";

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";

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
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import {
  EXTRA_LEAVE_OPTIONS,
  LEAVE_TYPE_OPTIONS,
  SINGLE_DAY_TYPES,
} from "@/features/leave/constants/leave.constant";
import type { AdminEditFormValues } from "@/features/leave/schemas/leave.schema";

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;
}

/** Staff member picker backed by the assignable-users list. */
export function StaffSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const { data, isLoading } = useAssignableUsers();
  const users = data?.data ?? [];
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled || isLoading}>
      <SelectTrigger className="mt-1.5 w-full">
        <SelectValue placeholder={isLoading ? "Loading staff…" : "Choose a staff member"} />
      </SelectTrigger>
      <SelectContent>
        {users.map((u) => (
          <SelectItem key={u._id} value={u._id}>
            {u.firstName} {u.lastName}
            {u.designation ? ` · ${u.designation}` : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Leave fields shared by the "add leave for staff" and "edit request" dialogs.
 * The forms differ only in a few extra fields, so the generic is narrowed to the
 * common shape here.
 */
export function LeaveFields<T extends AdminEditFormValues>({
  form,
  showDecision,
}: {
  form: UseFormReturn<T>;
  /** Show the extra-leave decision block (needed when the change makes the request over balance). */
  showDecision: boolean;
}) {
  const f = form as unknown as UseFormReturn<AdminEditFormValues>;
  const {
    register,
    control,
    formState: { errors },
  } = f;
  const values = useWatch({ control });
  const leaveType = values.leaveType ?? "casual";
  const singleDay = SINGLE_DAY_TYPES.includes(leaveType);

  return (
    <>
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
          <Label htmlFor="lf-start">{singleDay ? "Date" : "From"}</Label>
          <Input id="lf-start" type="date" className="mt-1.5" {...register("startDate")} />
          <FieldError message={errors.startDate?.message} />
        </div>
        {!singleDay && (
          <div>
            <Label htmlFor="lf-end">To</Label>
            <Input id="lf-end" type="date" className="mt-1.5" {...register("endDate")} />
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
          <Label htmlFor="lf-time">Leave time</Label>
          <Input id="lf-time" type="time" className="mt-1.5" {...register("leaveTime")} />
          <FieldError message={errors.leaveTime?.message} />
        </div>
      )}

      {leaveType === "late_arrival" && (
        <div>
          <Label htmlFor="lf-arrival">Expected arrival time</Label>
          <Input id="lf-arrival" type="time" className="mt-1.5" {...register("expectedArrivalTime")} />
          <FieldError message={errors.expectedArrivalTime?.message} />
        </div>
      )}

      <div>
        <Label htmlFor="lf-reason">Reason</Label>
        <Textarea id="lf-reason" rows={2} className="mt-1.5" {...register("reason")} />
        <FieldError message={errors.reason?.message} />
      </div>

      {showDecision && (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">
            If this leaves the request over the staff member&apos;s balance, choose how the extra days are
            treated and leave a comment. Otherwise leave both empty.
          </p>
          <div>
            <Label>Extra leave type</Label>
            <Controller
              control={control}
              name="extraLeaveType"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Only if over balance" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXTRA_LEAVE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label} — {o.hint}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="lf-extra-note">Comment</Label>
            <Textarea id="lf-extra-note" rows={2} className="mt-1.5" {...register("extraApprovalNote")} />
            <FieldError message={errors.extraApprovalNote?.message} />
          </div>
        </div>
      )}
    </>
  );
}
