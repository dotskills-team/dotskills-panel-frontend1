"use client";

import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
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

import { useCreateAttendance, useUpdateAttendance } from "@/features/attendance/hooks/use-attendance";
import {
  makeAttendanceFormSchema,
  type AttendanceFormValues,
} from "@/features/attendance/schemas/attendance.schema";
import {
  formatDay,
  fromDhakaTimeInput,
  todayInDhaka,
  toDhakaTimeInput,
  userName,
} from "@/features/attendance/utils/attendance.utils";
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import type { IAttendance } from "@/types/attendance.types";

interface AttendanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The record to edit. Leave empty to create a record for a staff member. */
  record?: IAttendance | null;
}

const errMsg = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

const emptyValues = (): AttendanceFormValues => ({
  userId: "",
  date: todayInDhaka(),
  checkIn: "09:00",
  checkOut: "",
  breaks: [],
  editReason: "",
});

const valuesFromRecord = (record: IAttendance): AttendanceFormValues => ({
  userId: typeof record.user === "string" ? record.user : record.user._id,
  date: record.date,
  checkIn: toDhakaTimeInput(record.checkIn),
  checkOut: toDhakaTimeInput(record.checkOut),
  breaks: record.breaks.map((b) => ({ start: toDhakaTimeInput(b.start), end: toDhakaTimeInput(b.end) })),
  editReason: "",
});

/** Admin / manager dialog to edit a record, or to add one for a staff member. Times are Dhaka times. */
export function AttendanceFormDialog({ open, onOpenChange, record }: AttendanceFormDialogProps) {
  const isEdit = Boolean(record);
  const users = useAssignableUsers();
  const update = useUpdateAttendance();
  const create = useCreateAttendance();

  const schema = useMemo(() => makeAttendanceFormSchema(!isEdit), [isEdit]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceFormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues() });
  const { fields, append, remove } = useFieldArray({ control, name: "breaks" });

  useEffect(() => {
    if (open) reset(record ? valuesFromRecord(record) : emptyValues());
  }, [open, record, reset]);

  const onSubmit = handleSubmit(async (v) => {
    const checkIn = fromDhakaTimeInput(v.date, v.checkIn);
    const checkOut = v.checkOut ? fromDhakaTimeInput(v.date, v.checkOut) : null;
    const breaks = v.breaks.map((b) => ({
      start: fromDhakaTimeInput(v.date, b.start),
      end: b.end ? fromDhakaTimeInput(v.date, b.end) : null,
    }));

    try {
      if (record) {
        await update.mutateAsync({
          id: record._id,
          payload: { checkIn, checkOut, breaks, editReason: v.editReason },
        });
        toast.success("Attendance updated");
      } else {
        await create.mutateAsync({
          userId: v.userId,
          date: v.date,
          checkIn,
          checkOut,
          breaks,
          editReason: v.editReason,
        });
        toast.success("Attendance added");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(errMsg(e, "Unable to save attendance"));
    }
  });

  const pending = update.isPending || create.isPending;
  const staff = users.data?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit attendance" : "Add attendance"}</DialogTitle>
            <DialogDescription>
              {record
                ? `${userName(record.user)} · ${formatDay(record.date)}. All times are Dhaka time.`
                : "Create a record for a staff member. All times are Dhaka time."}
            </DialogDescription>
          </DialogHeader>

          {!isEdit && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Staff</Label>
                <Controller
                  control={control}
                  name="userId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 w-full">
                        <SelectValue placeholder="Choose staff">
                          {(() => {
                            const u = staff.find((s) => s._id === field.value);
                            return u ? `${u.firstName} ${u.lastName}`.trim() : undefined;
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {`${s.firstName} ${s.lastName}`.trim()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.userId && <p className="mt-1 text-xs text-destructive">{errors.userId.message}</p>}
              </div>
              <div>
                <Label htmlFor="att-date">Date</Label>
                <Input id="att-date" type="date" className="mt-1.5" {...register("date")} />
                {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="att-in">Check in</Label>
              <Input id="att-in" type="time" className="mt-1.5" {...register("checkIn")} />
              {errors.checkIn && <p className="mt-1 text-xs text-destructive">{errors.checkIn.message}</p>}
            </div>
            <div>
              <Label htmlFor="att-out">Check out</Label>
              <Input id="att-out" type="time" className="mt-1.5" {...register("checkOut")} />
              {errors.checkOut && <p className="mt-1 text-xs text-destructive">{errors.checkOut.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Breaks</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ start: "13:00", end: "13:30" })}>
                <Plus /> Add break
              </Button>
            </div>
            {fields.length === 0 && <p className="text-xs text-muted-foreground">No breaks.</p>}
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <Input type="time" aria-label="Break start" {...register(`breaks.${index}.start`)} />
                  {errors.breaks?.[index]?.start && (
                    <p className="mt-1 text-xs text-destructive">{errors.breaks[index]?.start?.message}</p>
                  )}
                </div>
                <div className="flex-1">
                  <Input type="time" aria-label="Break end" {...register(`breaks.${index}.end`)} />
                  {errors.breaks?.[index]?.end && (
                    <p className="mt-1 text-xs text-destructive">{errors.breaks[index]?.end?.message}</p>
                  )}
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove break" onClick={() => remove(index)}>
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>

          {record?.isEdited && record.editReason && (
            <div className="rounded-lg border bg-muted/40 p-3 text-xs">
              <p className="font-medium">Previous edit reason</p>
              <p className="mt-1 text-muted-foreground">{record.editReason}</p>
            </div>
          )}

          <div>
            <Label htmlFor="att-reason">{isEdit ? "New reason (required)" : "Reason (required)"}</Label>
            <Textarea id="att-reason" rows={3} className="mt-1.5" {...register("editReason")} />
            {errors.editReason && <p className="mt-1 text-xs text-destructive">{errors.editReason.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {isEdit ? "Save changes" : "Add record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
