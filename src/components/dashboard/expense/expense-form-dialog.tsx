"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useCreateExpense, useUpdateExpense } from "@/features/expense/hooks/use-expense";
import { createExpenseSchema, updateExpenseSchema } from "@/features/expense/schemas/expense.schema";
import { useExpenseCategories } from "@/features/expense-category/hooks/use-expense-category";
import { useFinancialAccounts } from "@/features/financial-account/hooks/use-financial-account";
import type { IExpense } from "@/types/expense.types";

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

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing?: IExpense | null;
}

const emptyForm = {
  amount: "",
  categoryId: "",
  financialAccountId: "",
  expenseDate: new Date().toISOString().slice(0, 10),
  description: "",
  reference: "",
};

const idOf = (value: string | { _id: string }) =>
  typeof value === "string" ? value : value._id;

export function ExpenseFormDialog({ open, onOpenChange, existing }: ExpenseFormDialogProps) {
  const isEdit = Boolean(existing);
  const [form, setForm] = useState(emptyForm);

  const categoriesQuery = useExpenseCategories({ status: "ACTIVE" as never, limit: 100 }, { enabled: open });
  const accountsQuery = useFinancialAccounts({ status: "ACTIVE" as never, limit: 100 }, { enabled: open });

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (existing) {
      setForm({
        amount: String(existing.amount),
        categoryId: idOf(existing.categoryId),
        financialAccountId: idOf(existing.financialAccountId),
        expenseDate: existing.expenseDate.slice(0, 10),
        description: existing.description ?? "",
        reference: existing.reference ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [existing, open]);

//   const submit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     const schema = isEdit ? updateExpenseSchema : createExpenseSchema;
//     const parsed = schema.safeParse({ ...form, amount: Number(form.amount) });

//     if (!parsed.success) {
//       toast.error(parsed.error.issues[0]?.message ?? "Please check the expense details.");
//       return;
//     }

//     try {
//       if (isEdit && existing) {
//         await updateMutation.mutateAsync({ id: existing._id, payload: parsed.data });
//         toast.success("Expense updated successfully.");
//       } else {
//         await createMutation.mutateAsync(parsed.data);
//         toast.success("Expense created successfully.");
//       }
//       onOpenChange(false);
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Unable to save expense.");
//     }
//   };
const submit = async (event: React.FormEvent) => {
  event.preventDefault();

  const formData = {
    ...form,
    amount: Number(form.amount),
  };

  try {
    if (isEdit && existing) {
      const parsed = updateExpenseSchema.safeParse(formData);

      if (!parsed.success) {
        toast.error(
          parsed.error.issues[0]?.message ??
            "Please check the expense details.",
        );
        return;
      }

      await updateMutation.mutateAsync({
        id: existing._id,
        payload: parsed.data,
      });

      toast.success("Expense updated successfully.");
    } else {
      const parsed = createExpenseSchema.safeParse(formData);

      if (!parsed.success) {
        toast.error(
          parsed.error.issues[0]?.message ??
            "Please check the expense details.",
        );
        return;
      }

      await createMutation.mutateAsync(parsed.data);

      toast.success("Expense created successfully.");
    }

    onOpenChange(false);
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to save expense.",
    );
  }
};
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Expense" : "Create Expense"}</DialogTitle>
          <DialogDescription>
            Record a company expense against a category and financial account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Amount
              <Input
                type="number"
                min="1"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Expense Date
              <Input
                type="date"
                value={form.expenseDate}
                onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Category
              <Select
                value={form.categoryId}
                onValueChange={(value) => setForm({ ...form, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesQuery.data?.data.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Financial Account
              <Select
                value={form.financialAccountId}
                onValueChange={(value) => setForm({ ...form, financialAccountId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accountsQuery.data?.data.map((account) => (
                    <SelectItem key={account._id} value={account._id}>
                      {account.accountName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            Reference
            <Input
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              placeholder="Invoice / receipt reference"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Description
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Facebook advertising"
              maxLength={500}
            />
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.categoryId || !form.financialAccountId}
              className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
            >
              {isPending ? "Saving..." : isEdit ? "Update Expense" : "Create Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseFormDialog;