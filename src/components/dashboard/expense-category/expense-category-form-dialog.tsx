"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useCreateExpenseCategory,
  useUpdateExpenseCategory,
} from "@/features/expense-category/hooks/use-expense-category";
import {
  createExpenseCategorySchema,
  updateExpenseCategorySchema,
} from "@/features/expense-category/schemas/expense-category.schema";
import { CATEGORY_STATUS_OPTIONS } from "@/features/expense-category/constants/expense-category.constant";
import { CategoryStatus, type IExpenseCategory } from "@/types/expense-category.types";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpenseCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing?: IExpenseCategory | null;
}

const emptyForm = {
  name: "",
  description: "",
  status: CategoryStatus.ACTIVE,
};

export function ExpenseCategoryFormDialog({
  open,
  onOpenChange,
  existing,
}: ExpenseCategoryFormDialogProps) {
  const isEdit = Boolean(existing);
  const [form, setForm] = useState(emptyForm);
  const createMutation = useCreateExpenseCategory();
  const updateMutation = useUpdateExpenseCategory();
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        description: existing.description ?? "",
        status: existing.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [existing, open]);

//   const submit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     const schema = isEdit ? updateExpenseCategorySchema : createExpenseCategorySchema;
//     const parsed = schema.safeParse(form);

//     if (!parsed.success) {
//       toast.error(parsed.error.issues[0]?.message ?? "Please check the category details.");
//       return;
//     }

//     try {
//       if (isEdit && existing) {
//         await updateMutation.mutateAsync({ id: existing._id, payload: parsed.data });
//         toast.success("Expense category updated successfully.");
//       } else {
//         await createMutation.mutateAsync(parsed.data);
//         toast.success("Expense category created successfully.");
//       }
//       onOpenChange(false);
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Unable to save expense category.",
//       );
//     }
//   };
const submit = async (event: React.FormEvent) => {
  event.preventDefault();

  try {
    if (isEdit && existing) {
      const parsed = updateExpenseCategorySchema.safeParse(form);

      if (!parsed.success) {
        toast.error(
          parsed.error.issues[0]?.message ??
            "Please check the category details.",
        );
        return;
      }

      await updateMutation.mutateAsync({
        id: existing._id,
        payload: parsed.data,
      });

      toast.success("Expense category updated successfully.");
    } else {
      const parsed = createExpenseCategorySchema.safeParse(form);

      if (!parsed.success) {
        toast.error(
          parsed.error.issues[0]?.message ??
            "Please check the category details.",  
        );
        return;
      }

      await createMutation.mutateAsync(parsed.data);

      toast.success("Expense category created successfully.");
    }

    onOpenChange(false);
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to save expense category.",
    );
  }
};
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogDescription>
            Categories help organize expenses for reporting (Marketing, Office, Salary, etc).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Name
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Marketing"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Description
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Facebook Ads, Google Ads and other marketing expenses"
              maxLength={500}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Status
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value as CategoryStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
            >
              {isPending ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseCategoryFormDialog;