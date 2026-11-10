"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { bulkKpiFormSchema } from "@/features/kpi/schemas/kpi.schema";
import { useBulkCreateKpi, useKpiTeamMembers } from "@/features/kpi/hooks/use-kpi";
import { canManageMemberKpi, formatMonthLabel, getMemberName } from "@/features/kpi/utils/kpi.utils";
import { useAuthStore } from "@/stores";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { KpiBulkResult, KpiUserRef } from "@/types/kpi.types";
import { KpiMonthPicker } from "./kpi-month-picker";

type FormInput = z.input<typeof bulkKpiFormSchema>;
type FormOutput = z.output<typeof bulkKpiFormSchema>;

interface BulkKpiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The month currently shown on the page. */
  month: string;
  /** Members who already have a KPI in `month`; skipped by default. */
  takenUserIds: Set<string>;
}

export function BulkKpiDialog({ open, onOpenChange, month, takenUserIds }: BulkKpiDialogProps) {
  const [targetMonth, setTargetMonth] = useState(month);
  const [result, setResult] = useState<KpiBulkResult | null>(null);

  const membersQuery = useKpiTeamMembers({ enabled: open });
  const viewer = useAuthStore((s) => s.user);
  // The lead can set KPIs for regular members and themselves; other leads are set by an admin
  const members: KpiUserRef[] = (membersQuery.data?.data ?? []).filter((m) =>
    canManageMemberKpi(viewer, m),
  );
  const bulkMutation = useBulkCreateKpi();

  const { register, control, handleSubmit, reset, formState } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(bulkKpiFormSchema),
    defaultValues: { rows: [] },
  });
  const { fields } = useFieldArray({ control, name: "rows" });

  // One row per member. Members who already have a KPI this month start unchecked.
  useEffect(() => {
    if (!open) return;
    reset({
      rows: members.map((m) => ({
        user: m._id,
        include: targetMonth === month ? !takenUserIds.has(m._id) : true,
        targetSales: 0,
        targetProjects: 0,
        budget: 0,
      })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, membersQuery.data, targetMonth, month]);

  const nameOf = (id: string) => {
    const m = members.find((x) => x._id === id);
    return m ? getMemberName(m) : id;
  };

  const onSubmit = async (values: FormOutput) => {
    const items = values.rows
      .filter((r) => r.include)
      .map((r) => ({
        user: r.user,
        targetSales: r.targetSales,
        targetProjects: r.targetProjects,
        budget: r.budget,
        extraItems: [],
      }));

    if (items.length === 0) {
      toast.error("Select at least one member.");
      return;
    }

    try {
      const res = await bulkMutation.mutateAsync({ month: targetMonth, items });
      setResult(res.data);
      toast.success(`${res.data.created.length} KPI(s) created.`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to set KPIs."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Bulk set KPI</DialogTitle>
          <DialogDescription>
            Set sales, project and budget targets for several members at once for{" "}
            {formatMonthLabel(targetMonth)}. KPIs are created as drafts. Members who already have a
            KPI for the month are skipped.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {result.created.length} KPI(s) created for {formatMonthLabel(targetMonth)}.
            </div>

            {result.skipped.length > 0 && (
              <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                <p className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                  <XCircle className="h-4 w-4 shrink-0" />
                  {result.skipped.length} skipped
                </p>
                <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
                  {result.skipped.map((s) => (
                    <li key={s.user}>
                      <span className="font-medium">{nameOf(s.user)}</span>: {s.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Month</p>
              <KpiMonthPicker value={targetMonth} onChange={setTargetMonth} />
            </div>

            {membersQuery.isLoading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : membersQuery.isError ? (
              <p className="py-6 text-center text-sm text-red-500">Could not load team members.</p>
            ) : members.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No team members found.</p>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="w-10 p-2" />
                      <th className="p-2">Member</th>
                      <th className="p-2">Target sales (BDT)</th>
                      <th className="p-2">Target projects</th>
                      <th className="p-2">Budget (BDT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => {
                      const rowErrors = formState.errors.rows?.[index];
                      return (
                        <tr key={field.id} className="border-t align-top">
                          <td className="p-2">
                            <Controller
                              control={control}
                              name={`rows.${index}.include`}
                              render={({ field: f }) => (
                                <Checkbox
                                  checked={Boolean(f.value)}
                                  onCheckedChange={(v) => f.onChange(v === true)}
                                  aria-label={`Include ${nameOf(field.user)}`}
                                />
                              )}
                            />
                          </td>
                          <td className="p-2 font-medium">
                            {nameOf(field.user)}
                            {targetMonth === month && takenUserIds.has(field.user) && (
                              <span className="block text-xs font-normal text-muted-foreground">
                                KPI already set
                              </span>
                            )}
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              className="w-36"
                              aria-label={`Target sales for ${nameOf(field.user)}`}
                              {...register(`rows.${index}.targetSales`)}
                            />
                            {rowErrors?.targetSales && (
                              <p className="mt-1 text-xs text-red-500">{rowErrors.targetSales.message}</p>
                            )}
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              className="w-28"
                              aria-label={`Target projects for ${nameOf(field.user)}`}
                              {...register(`rows.${index}.targetProjects`)}
                            />
                            {rowErrors?.targetProjects && (
                              <p className="mt-1 text-xs text-red-500">{rowErrors.targetProjects.message}</p>
                            )}
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              className="w-36"
                              aria-label={`Budget for ${nameOf(field.user)}`}
                              {...register(`rows.${index}.budget`)}
                            />
                            {rowErrors?.budget && (
                              <p className="mt-1 text-xs text-red-500">{rowErrors.budget.message}</p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={bulkMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={bulkMutation.isPending || members.length === 0}>
                {bulkMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Set KPIs
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
