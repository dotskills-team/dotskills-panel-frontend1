"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatBdt } from "@/features/kpi/utils/kpi.utils";

// The parent form passes its own typed control; only the budgetItems shape matters here.
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  control: Control<any, any, any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}

/** The budget is built from items; the total is the sum of their amounts and is never typed in. */
export function KpiBudgetItemsField({ control, register, errors, disabled }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "budgetItems" });
  const watched = useWatch({ control, name: "budgetItems" }) as
    | { amount?: number | string }[]
    | undefined;

  const total = (watched ?? []).reduce((sum, item) => {
    const amount = Number(item?.amount);
    return sum + (Number.isFinite(amount) && amount > 0 ? amount : 0);
  }, 0);

  const itemErrors = errors.budgetItems as
    | (Record<string, { message?: string }> | undefined)[]
    | { message?: string }
    | undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Budget</p>
          <p className="text-xs text-muted-foreground">
            Add an item for each budget line. The total is calculated from them.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || fields.length >= 30}
          onClick={() => append({ name: "", amount: 0 })}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add item
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
          No budget items yet.
        </p>
      )}

      {fields.map((field, index) => {
        const rowErrors = Array.isArray(itemErrors) ? itemErrors[index] : undefined;
        return (
          <div key={field.id} className="space-y-1">
            <div className="grid grid-cols-[1fr_9rem_auto] items-start gap-2">
              <Input
                placeholder="Name (e.g. Facebook ads)"
                disabled={disabled}
                aria-label={`Budget item ${index + 1} name`}
                {...register(`budgetItems.${index}.name`)}
              />
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="Amount (BDT)"
                disabled={disabled}
                aria-label={`Budget item ${index + 1} amount`}
                {...register(`budgetItems.${index}.amount`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                aria-label={`Remove budget item ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            {rowErrors && (
              <p className="text-xs text-red-500">
                {rowErrors.name?.message ?? rowErrors.amount?.message}
              </p>
            )}
          </div>
        );
      })}

      {!Array.isArray(itemErrors) && itemErrors?.message && (
        <p className="text-xs text-red-500">{itemErrors.message}</p>
      )}

      <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
        <span className="text-muted-foreground">Total budget</span>
        <span className="font-semibold tabular-nums">{formatBdt(total)}</span>
      </div>
    </div>
  );
}
