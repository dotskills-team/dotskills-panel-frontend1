"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useCreateFinancialAccount,
  useUpdateFinancialAccount,
} from "@/features/financial-account/hooks/use-financial-account";
import {
  createFinancialAccountSchema,
  updateFinancialAccountSchema,
} from "@/features/financial-account/schemas/financial-account.schema";
import {
  ACCOUNT_STATUS_OPTIONS,
  ACCOUNT_TYPE_OPTIONS,
  PROVIDER_OPTIONS,
} from "@/features/financial-account/constants/financial-account.constant";
import {
  AccountStatus,
  AccountType,
  ProviderName,
  type IFinancialAccount,
} from "@/types/financial-account.types";

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
import { useUsers } from "@/features/users/hooks/useUsers";
import { getUserFullName } from "@/features/users/utils/user.utils";

interface FinancialAccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing?: IFinancialAccount | null;
}

const emptyForm = {
  accountName: "",
  accountType: AccountType.CASH,
  providerName: undefined as ProviderName | undefined,
  accountNumber: "",
  accountHolderName: "",
  bankName: "",
  branchName: "",
  openingBalance: "0",
  currency: "BDT",
  description: "",
  status: AccountStatus.ACTIVE,
  ownerId: "NONE",
};

export function FinancialAccountFormDialog({
  open,
  onOpenChange,
  existing,
}: FinancialAccountFormDialogProps) {
  const isEdit = Boolean(existing);
  const [form, setForm] = useState(emptyForm);
  const createMutation = useCreateFinancialAccount();
  const updateMutation = useUpdateFinancialAccount();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const usersQuery = useUsers({ page: 1, limit: 100, status: "ACTIVE" }, { enabled: open });
  const users = usersQuery.data?.data ?? [];
  useEffect(() => {
    if (existing) {
      setForm({
        accountName: existing.accountName,
        accountType: existing.accountType,
        providerName: existing.providerName,
        accountNumber: existing.accountNumber ?? "",
        accountHolderName: existing.accountHolderName ?? "",
        bankName: existing.bankName ?? "",
        branchName: existing.branchName ?? "",
        openingBalance: String(existing.openingBalance),
        currency: existing.currency,
        description: existing.description ?? "",
        status: existing.status,
        ownerId:
          typeof existing.ownerId === "string"
            ? existing.ownerId
            : existing.ownerId?._id ?? "NONE",
      });
    } else {
      setForm(emptyForm);
    }
  }, [existing, open]);

  // const submit = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   const schema = isEdit
  //     ? updateFinancialAccountSchema
  //     : createFinancialAccountSchema;

  //   const parsed = schema.safeParse({
  //     ...form,
  //     openingBalance: Number(form.openingBalance),
  //   });

  //   if (!parsed.success) {
  //     toast.error(
  //       parsed.error.issues[0]?.message ?? "Please check the account details.",
  //     );
  //     return;
  //   }

  //   try {
  //     if (isEdit && existing) {
  //       await updateMutation.mutateAsync({ id: existing._id, payload: parsed.data });
  //       toast.success("Financial account updated successfully.");
  //     } else {
  //       await createMutation.mutateAsync(parsed.data);
  //       toast.success("Financial account created successfully.");
  //     }
  //     onOpenChange(false);
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error ? error.message : "Unable to save financial account.",
  //     );
  //   }
  // };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const ownerId =
      form.ownerId && form.ownerId !== "NONE" ? form.ownerId : isEdit ? null : undefined;
    const providerName =
      form.accountType === AccountType.MOBILE_BANKING && form.providerName
        ? form.providerName
        : isEdit
          ? null
          : undefined;
    const formData = {
      ...form,
      ownerId,
      providerName,
      openingBalance: Number(form.openingBalance),
    };

    try {
      if (isEdit && existing) {
        const parsed = updateFinancialAccountSchema.safeParse(formData);

        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message ?? "Please check the account details.");
          return;
        }

        await updateMutation.mutateAsync({
          id: existing._id,
          payload: parsed.data,
        });

        toast.success("Financial account updated successfully.");
      } else {
        const parsed = createFinancialAccountSchema.safeParse(formData);

        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message ?? "Please check the account details.");
          return;
        }

        await createMutation.mutateAsync(parsed.data);

        toast.success("Financial account created successfully.");
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save financial account.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Financial Account" : "Create Financial Account"}
          </DialogTitle>
          <DialogDescription>
            Cash, bank, or mobile banking accounts used for expenses and revenue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Account Name
            <Input
              value={form.accountName}
              onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              placeholder="Company bKash"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Account Type
              <Select
                value={form.accountType}
                onValueChange={(value) =>
                  setForm({ ...form, accountType: value as AccountType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            {form.accountType === AccountType.MOBILE_BANKING && (
              <label className="grid gap-2 text-sm font-medium">
                Provider
                <Select
                  value={form.providerName}
                  onValueChange={(value) =>
                    setForm({ ...form, providerName: value as ProviderName })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Account Number
              <Input
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                placeholder="017XXXXXXXX"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Account Holder Name
              <Input
                value={form.accountHolderName}
                onChange={(e) =>
                  setForm({ ...form, accountHolderName: e.target.value })
                }
              />
            </label>
          </div>

          {form.accountType === AccountType.BANK && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Bank Name
                <Input
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Branch Name
                <Input
                  value={form.branchName}
                  onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                />
              </label>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Opening Balance
              <Input
                type="number"
                min="0"
                value={form.openingBalance}
                onChange={(e) => setForm({ ...form, openingBalance: e.target.value })}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Currency
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Account Owner / Responsible Person
            <Select
              value={form.ownerId}
              onValueChange={(value) => setForm({ ...form, ownerId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">No owner</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {getUserFullName(user)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Status
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value as AccountStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Description
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional note"
              maxLength={500}
            />
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
              {isPending ? "Saving..." : isEdit ? "Update Account" : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FinancialAccountFormDialog;