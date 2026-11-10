"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { individualKpiFormSchema } from "@/features/kpi/schemas/kpi.schema";
import {
  useCreateKpi,
  useKpiList,
  useKpiTeamMembers,
  useUpdateKpi,
} from "@/features/kpi/hooks/use-kpi";
import {
  buildExtraItems,
  canManageMemberKpi,
  formatMonthLabel,
  getMemberName,
} from "@/features/kpi/utils/kpi.utils";
import { useAuthStore } from "@/stores";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { IKpi, KpiType } from "@/types/kpi.types";
import { KpiExtraItemsField } from "./kpi-extra-items-field";

type FormInput = z.input<typeof individualKpiFormSchema>;
type FormOutput = z.output<typeof individualKpiFormSchema>;

const EMPTY: FormInput = {
  user: "",
  targetSales: 0,
  targetProjects: 0,
  budget: 0,
  extraItems: [],
  note: "",
  activateNow: false,
};

interface KpiFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: string;
  kind: KpiType;
  /** Set when editing an existing KPI. For individual KPIs only its id/user are needed. */
  editing?: { _id: string; userId?: string } | null;
  /** Pre-selected member for the "Set KPI" quick action. */
  presetUserId?: string;
  /** Members that already have a KPI this month (cannot get a second one). */
  takenUserIds?: Set<string>;
}

export function KpiFormDialog({
  open,
  onOpenChange,
  month,
  kind,
  editing,
  presetUserId,
  takenUserIds,
}: KpiFormDialogProps) {
  const isEdit = Boolean(editing);
  const isTeam = kind === "team";

  const membersQuery = useKpiTeamMembers({ enabled: open && !isTeam && !isEdit });
  // The progress rows only carry a summary, so load the full KPI (extra items, note) to edit it
  const fullKpiQuery = useKpiList(
    { month, type: kind, userId: editing?.userId, limit: 100 },
    { enabled: open && isEdit },
  );
  const fullKpi: IKpi | undefined = fullKpiQuery.data?.data?.find((k) => k._id === editing?._id);

  const createMutation = useCreateKpi();
  const updateMutation = useUpdateKpi();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(individualKpiFormSchema),
    defaultValues: EMPTY,
  });

  // Fill the form whenever the dialog opens (create) or the full KPI arrives (edit)
  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      if (fullKpi) {
        reset({
          user: fullKpi.user?._id ?? "",
          targetSales: fullKpi.targetSales,
          targetProjects: fullKpi.targetProjects,
          budget: fullKpi.budget,
          extraItems: fullKpi.extraItems.map((i) => ({ ...i })),
          note: fullKpi.note ?? "",
          activateNow: false,
        });
      }
    } else {
      reset({ ...EMPTY, user: presetUserId ?? "" });
    }
  }, [open, isEdit, fullKpi, presetUserId, reset]);

  const onSubmit = async (values: FormOutput) => {
    const extraItems = buildExtraItems(values.extraItems);

    try {
      if (isEdit && editing) {
        await updateMutation.mutateAsync({
          id: editing._id,
          payload: {
            targetSales: values.targetSales,
            targetProjects: values.targetProjects,
            budget: values.budget,
            extraItems,
            note: values.note ?? "",
          },
        });
        toast.success("KPI updated.");
      } else {
        if (!isTeam && !values.user) {
          toast.error("Select a team member.");
          return;
        }
        await createMutation.mutateAsync({
          type: kind,
          month,
          user: isTeam ? undefined : values.user,
          targetSales: values.targetSales,
          targetProjects: values.targetProjects,
          budget: values.budget,
          extraItems,
          status: values.activateNow ? "active" : "draft",
          note: values.note || undefined,
        });
        toast.success(isTeam ? "Team KPI saved." : "KPI added.");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save the KPI."));
    }
  };

  const viewer = useAuthStore((s) => s.user);
  // The lead can pick regular members and themselves; other leads are set by an admin
  const members = (membersQuery.data?.data ?? []).filter((m) => canManageMemberKpi(viewer, m));
  const title = isTeam
    ? isEdit
      ? "Edit team KPI"
      : "Set team KPI"
    : isEdit
      ? "Edit KPI"
      : "Add KPI";
  const loadingExisting = isEdit && fullKpiQuery.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Targets for {formatMonthLabel(month)}. All amounts are in BDT.
          </DialogDescription>
        </DialogHeader>

        {isEdit && fullKpiQuery.isError ? (
          <p className="py-6 text-center text-sm text-red-500">Could not load this KPI.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {!isTeam && !isEdit && (
              <div className="space-y-1.5">
                <Label>Team member</Label>
                <Controller
                  control={control}
                  name="user"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={membersQuery.isLoading ? "Loading members..." : "Select a member"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((m) => (
                          <SelectItem key={m._id} value={m._id} disabled={takenUserIds?.has(m._id)}>
                            {getMemberName(m)}
                            {takenUserIds?.has(m._id) ? " (KPI already set)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {membersQuery.isError && (
                  <p className="text-xs text-red-500">Could not load team members.</p>
                )}
                {!membersQuery.isLoading && !membersQuery.isError && members.length === 0 && (
                  <p className="text-xs text-muted-foreground">No team members found.</p>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="kpi-target-sales">Target sales (BDT)</Label>
                <Input
                  id="kpi-target-sales"
                  type="number"
                  min={0}
                  step="any"
                  disabled={loadingExisting}
                  {...register("targetSales")}
                />
                {errors.targetSales && (
                  <p className="text-xs text-red-500">{errors.targetSales.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kpi-target-projects">Target projects</Label>
                <Input
                  id="kpi-target-projects"
                  type="number"
                  min={0}
                  step={1}
                  disabled={loadingExisting}
                  {...register("targetProjects")}
                />
                {errors.targetProjects && (
                  <p className="text-xs text-red-500">{errors.targetProjects.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="kpi-budget">Budget (BDT)</Label>
                <Input
                  id="kpi-budget"
                  type="number"
                  min={0}
                  step="any"
                  disabled={loadingExisting}
                  {...register("budget")}
                />
                {errors.budget && <p className="text-xs text-red-500">{errors.budget.message}</p>}
              </div>
            </div>

            <KpiExtraItemsField
              // The field only touches `extraItems`, so the form's typed control is passed untyped
              control={control as never}
              register={register as never}
              errors={errors as never}
              disabled={loadingExisting}
            />

            <div className="space-y-1.5">
              <Label htmlFor="kpi-note">Note</Label>
              <Textarea
                id="kpi-note"
                rows={3}
                placeholder="Optional"
                disabled={loadingExisting}
                {...register("note")}
              />
              {errors.note && <p className="text-xs text-red-500">{errors.note.message}</p>}
            </div>

            {!isEdit && (
              <Controller
                control={control}
                name="activateNow"
                render={({ field }) => (
                  <label className="flex items-start gap-2 text-sm">
                    <Checkbox
                      checked={Boolean(field.value)}
                      onCheckedChange={(v) => field.onChange(v === true)}
                      className="mt-0.5"
                    />
                    <span>
                      Activate now
                      <span className="block text-xs text-muted-foreground">
                        Otherwise it is saved as a draft and the member does not see it yet.
                      </span>
                    </span>
                  </label>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || loadingExisting}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Save changes" : "Save KPI"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
