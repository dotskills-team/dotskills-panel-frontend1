"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  Controller,
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// The parent form passes its own typed control; only the extraItems shape matters here.
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  control: Control<any, any, any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}

export function KpiExtraItemsField({ control, register, errors, disabled }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "extraItems" });
  const itemErrors = errors.extraItems as
    | (Record<string, { message?: string }> | undefined)[]
    | { message?: string }
    | undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Extra items</p>
          <p className="text-xs text-muted-foreground">
            Extra targets such as a leads count or an ad spend amount.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || fields.length >= 20}
          onClick={() => append({ name: "", unit: "count", target: 0 })}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add item
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
          No extra items.
        </p>
      )}

      {fields.map((field, index) => {
        const rowErrors = Array.isArray(itemErrors) ? itemErrors[index] : undefined;
        return (
          <div key={field.id} className="space-y-1">
            <div className="grid grid-cols-[1fr_6.5rem_6.5rem_auto] items-start gap-2">
              <Input
                placeholder="Name"
                disabled={disabled}
                aria-label={`Extra item ${index + 1} name`}
                {...register(`extraItems.${index}.name`)}
              />
              <Controller
                control={control}
                name={`extraItems.${index}.unit`}
                render={({ field: f }) => (
                  <Select value={f.value} onValueChange={f.onChange} disabled={disabled}>
                    <SelectTrigger aria-label={`Extra item ${index + 1} unit`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="count">Count</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="Target"
                disabled={disabled}
                aria-label={`Extra item ${index + 1} target`}
                {...register(`extraItems.${index}.target`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                aria-label={`Remove extra item ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            {rowErrors && (
              <p className="text-xs text-red-500">
                {rowErrors.name?.message ?? rowErrors.target?.message}
              </p>
            )}
          </div>
        );
      })}

      {!Array.isArray(itemErrors) && itemErrors?.message && (
        <p className="text-xs text-red-500">{itemErrors.message}</p>
      )}
    </div>
  );
}
