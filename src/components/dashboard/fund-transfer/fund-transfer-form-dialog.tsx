"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { useCreateFundTransfer } from "@/features/fund-transfer/hooks/use-fund-transfer";
import { createFundTransferSchema } from "@/features/fund-transfer/schemas/fund-transfer.schema";
import { useFinancialAccounts } from "@/features/financial-account/hooks/use-financial-account";

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

const money = (value?: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(value ?? 0);

const emptyForm = {
  fromAccountId: "",
  toAccountId: "",
  amount: "",
  transferDate: new Date().toISOString().slice(0, 10),
  reference: "",
  note: "",
};

export function FundTransferFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const mutation = useCreateFundTransfer();
  const accountsQuery = useFinancialAccounts({ status: "ACTIVE" as never, limit: 100 }, { enabled: open });
  const accounts = accountsQuery.data?.data ?? [];

  useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const fromAccount = accounts.find((a) => a._id === form.fromAccountId);
  const toAccount = accounts.find((a) => a._id === form.toAccountId);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsed = createFundTransferSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the transfer details.");
      return;
    }

    if (fromAccount && parsed.data.amount > fromAccount.currentBalance) {
      toast.error(`Insufficient balance. Available: ${money(fromAccount.currentBalance)}`);
      return;
    }

    try {
      await mutation.mutateAsync(parsed.data);
      toast.success("Fund transferred successfully.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to transfer fund.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Transfer Fund</DialogTitle>
          <DialogDescription>Move money from one financial account to another.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <label className="grid gap-2 text-sm font-medium">
              From Account
              <Select
                value={form.fromAccountId}
                onValueChange={(value) => setForm({ ...form, fromAccountId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account._id} value={account._id}>
                      {account.accountName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fromAccount && (
                <span className="text-xs font-normal text-muted-foreground">
                  Balance: {money(fromAccount.currentBalance)}
                </span>
              )}
            </label>

            <ArrowRight className="mb-7 hidden size-5 text-muted-foreground sm:block" />

            <label className="grid gap-2 text-sm font-medium">
              To Account
              <Select
                value={form.toAccountId}
                onValueChange={(value) => setForm({ ...form, toAccountId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((a) => a._id !== form.fromAccountId)
                    .map((account) => (
                      <SelectItem key={account._id} value={account._id}>
                        {account.accountName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {toAccount && (
                <span className="text-xs font-normal text-muted-foreground">
                  Balance: {money(toAccount.currentBalance)}
                </span>
              )}
            </label>
          </div>

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
              Transfer Date
              <Input
                type="date"
                value={form.transferDate}
                onChange={(e) => setForm({ ...form, transferDate: e.target.value })}
                required
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            Reference
            <Input
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              placeholder="Transaction ID / reference"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Note
            <Textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
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
              disabled={mutation.isPending}
              className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
            >
              {mutation.isPending ? "Transferring..." : "Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FundTransferFormDialog;