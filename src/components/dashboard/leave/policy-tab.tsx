"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarOff,
  Coins,
  Loader2,
  Plus,
  Repeat,
  Send,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useLeavePolicy, useUpdateLeavePolicy } from "@/features/leave/hooks/use-leave";
import { policySchema, type PolicyFormValues } from "@/features/leave/schemas/leave.schema";
import { EXTRA_LEAVE_OPTIONS } from "@/features/leave/constants/leave.constant";
import { StaffSelect } from "./leave-fields";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Used until the saved policy loads, and for any field the saved policy is missing. */
const POLICY_DEFAULTS: PolicyFormValues = {
  annualLeaveQuota: 20,
  staffQuotaOverrides: [],
  weeklyOffDays: [5],
  publicHolidays: [],
  minAdvanceNoticeDays: 1,
  allowPastDateRequestsAdminOnly: true,
  yearEndRule: "reset",
  carryForwardMax: 0,
  defaultExtraLeaveType: "unpaid",
  maxExtraDaysWarning: 5,
  pendingReminderAfterDays: 2,
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;
}

/** First validation message in a nested react-hook-form error object. */
function firstErrorMessage(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;
  const e = errors as { message?: unknown };
  if (typeof e.message === "string") return e.message;
  for (const value of Object.values(errors)) {
    const found = firstErrorMessage(value);
    if (found) return found;
  }
  return null;
}

function Section({
  title,
  hint,
  icon: Icon,
  children,
}: {
  title: string;
  hint?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-0">
        <div className="flex items-start gap-3 border-b bg-muted/30 px-5 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        </div>
        <div className="space-y-4 px-5 pb-5">{children}</div>
      </CardContent>
    </Card>
  );
}

export function PolicyTab() {
  const { data, isLoading, isError, error } = useLeavePolicy();
  const save = useUpdateLeavePolicy();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: POLICY_DEFAULTS,
  });

  const holidays = useFieldArray({ control, name: "publicHolidays" });
  const overrides = useFieldArray({ control, name: "staffQuotaOverrides" });

  useEffect(() => {
    const p = data?.data;
    if (!p) return;
    const d = POLICY_DEFAULTS;
    reset({
      annualLeaveQuota: p.annualLeaveQuota ?? d.annualLeaveQuota,
      staffQuotaOverrides: (p.staffQuotaOverrides ?? []).map((o) => ({ staff: String(o.staff), quota: o.quota })),
      weeklyOffDays: p.weeklyOffDays ?? d.weeklyOffDays,
      publicHolidays: (p.publicHolidays ?? []).map((h) => ({ date: h.date, name: h.name })),
      minAdvanceNoticeDays: p.minAdvanceNoticeDays ?? d.minAdvanceNoticeDays,
      allowPastDateRequestsAdminOnly: p.allowPastDateRequestsAdminOnly ?? d.allowPastDateRequestsAdminOnly,
      // Never pass an unknown value to a select: it would fail validation on save.
      yearEndRule: p.yearEndRule === "carry_forward" ? "carry_forward" : "reset",
      carryForwardMax: p.carryForwardMax ?? d.carryForwardMax,
      defaultExtraLeaveType:
        p.defaultExtraLeaveType === "advance" || p.defaultExtraLeaveType === "waived"
          ? p.defaultExtraLeaveType
          : "unpaid",
      maxExtraDaysWarning: p.maxExtraDaysWarning ?? d.maxExtraDaysWarning,
      pendingReminderAfterDays: p.pendingReminderAfterDays ?? d.pendingReminderAfterDays,
    });
  }, [data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await save.mutateAsync(values);
      toast.success("Leave policy saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to save policy");
    }
  }, (invalid) => {
    // Without this a failed validation looks like a dead button.
    toast.error(firstErrorMessage(invalid) ?? "Please check the highlighted fields");
  });

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error instanceof Error ? error.message : "Unable to load the policy."}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <Section icon={Coins} title="Yearly quota" hint="One total balance per person. There are no per-type quotas.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="p-quota">Default days per year</Label>
            <Input
              id="p-quota"
              type="number"
              step="0.5"
              className="mt-1.5"
              {...register("annualLeaveQuota", { valueAsNumber: true })}
            />
            <FieldError message={errors.annualLeaveQuota?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Per-person overrides</Label>
          {overrides.fields.map((field, i) => (
            <div key={field.id} className="flex flex-wrap items-start gap-2">
              <div className="min-w-48 flex-1">
                <Controller
                  control={control}
                  name={`staffQuotaOverrides.${i}.staff`}
                  render={({ field: f }) => <StaffSelect value={f.value} onChange={f.onChange} />}
                />
                <FieldError message={errors.staffQuotaOverrides?.[i]?.staff?.message} />
              </div>
              <div className="w-28">
                <Input
                  type="number"
                  step="0.5"
                  className="mt-1.5"
                  aria-label="Quota"
                  {...register(`staffQuotaOverrides.${i}.quota`, { valueAsNumber: true })}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-1.5"
                aria-label="Remove override"
                onClick={() => overrides.remove(i)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => overrides.append({ staff: "", quota: 0 })}>
            <Plus /> Add override
          </Button>
        </div>
      </Section>

      <Section icon={CalendarOff} title="Working days" hint="Weekly off days and public holidays are not counted as leave days.">
        <Controller
          control={control}
          name="weeklyOffDays"
          render={({ field }) => (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {WEEKDAYS.map((day, index) => (
                <Label key={day} className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                  <Checkbox
                    checked={field.value?.includes(index)}
                    onCheckedChange={(checked) =>
                      field.onChange(
                        checked
                          ? [...(field.value ?? []), index].sort()
                          : (field.value ?? []).filter((d) => d !== index),
                      )
                    }
                  />
                  {day}
                </Label>
              ))}
            </div>
          )}
        />

        <div className="space-y-2">
          <Label>Public holidays</Label>
          {holidays.fields.map((field, i) => (
            <div key={field.id} className="flex flex-wrap items-start gap-2">
              <div>
                <Input type="date" aria-label="Holiday date" {...register(`publicHolidays.${i}.date`)} />
                <FieldError message={errors.publicHolidays?.[i]?.date?.message} />
              </div>
              <div className="min-w-48 flex-1">
                <Input placeholder="Holiday name" {...register(`publicHolidays.${i}.name`)} />
                <FieldError message={errors.publicHolidays?.[i]?.name?.message} />
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Remove holiday" onClick={() => holidays.remove(i)}>
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => holidays.append({ date: "", name: "" })}>
            <Plus /> Add holiday
          </Button>
        </div>
      </Section>

      <Section icon={Send} title="Requests" hint="Notice and reminder rules for new requests.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="p-notice">Minimum advance notice (days)</Label>
            <Input
              id="p-notice"
              type="number"
              className="mt-1.5"
              {...register("minAdvanceNoticeDays", { valueAsNumber: true })}
            />
            <FieldError message={errors.minAdvanceNoticeDays?.message} />
          </div>
          <div>
            <Label htmlFor="p-stale">Remind approvers after (days pending)</Label>
            <Input
              id="p-stale"
              type="number"
              className="mt-1.5"
              {...register("pendingReminderAfterDays", { valueAsNumber: true })}
            />
            <FieldError message={errors.pendingReminderAfterDays?.message} />
          </div>
        </div>
        <Controller
          control={control}
          name="allowPastDateRequestsAdminOnly"
          render={({ field }) => (
            <Label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
              <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
              Only admins can add leave for past dates
            </Label>
          )}
        />
      </Section>

      <Section
        icon={TriangleAlert}
        title="Over-balance leave"
        hint="Staff can always apply when their balance is used up. Only admins can approve the extra days."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Default extra leave type</Label>
            <Controller
              control={control}
              name="defaultExtraLeaveType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXTRA_LEAVE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="p-warn">Warn when extra days exceed</Label>
            <Input
              id="p-warn"
              type="number"
              step="0.5"
              className="mt-1.5"
              {...register("maxExtraDaysWarning", { valueAsNumber: true })}
            />
            <FieldError message={errors.maxExtraDaysWarning?.message} />
          </div>
        </div>
      </Section>

      <Section icon={Repeat} title="Year end" hint="Applied by the yearly rollover on 1 January.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Unused leave</Label>
            <Controller
              control={control}
              name="yearEndRule"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reset">Reset to the new quota</SelectItem>
                    <SelectItem value="carry_forward">Carry forward</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="p-carry">Maximum carried forward (days)</Label>
            <Input
              id="p-carry"
              type="number"
              step="0.5"
              className="mt-1.5"
              {...register("carryForwardMax", { valueAsNumber: true })}
            />
            <FieldError message={errors.carryForwardMax?.message} />
          </div>
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-sm text-muted-foreground">
          {isDirty ? "You have unsaved changes." : "All changes saved."}
        </p>
        <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-500" disabled={save.isPending}>
          {save.isPending && <Loader2 className="animate-spin" />}
          Save policy
        </Button>
      </div>
    </form>
  );
}
