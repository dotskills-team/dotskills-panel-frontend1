"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTransfer } from "@/features/financial-account/hooks/use-ledger";
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

const money = (v?: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(v ?? 0);

const today = () => new Date().toISOString().slice(0, 10);

const initial = {
  fromAccountId: "",
  toAccountId: "",
  amount: "",
  transferDate: today(),
  note: "",
};

export function TransferDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(initial);
  const mutation = useTransfer();
  const accountsQuery = useFinancialAccounts(
    { limit: 100, status: "ACTIVE" } as never,
    { enabled: open },
  );
  const accounts = accountsQuery.data?.data ?? [];

  useEffect(() => {
    if (open) setForm({ ...initial, transferDate: today() });
  }, [open]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const amount = Number(form.amount);
    if (!form.fromAccountId || !form.toAccountId)
      return toast.error("Please select both accounts.");
    if (form.fromAccountId === form.toAccountId)
      return toast.error("From and To account cannot be the same.");
    if (!(amount > 0)) return toast.error("Amount must be greater than 0.");

    const from = accounts.find((a) => a._id === form.fromAccountId);
    if (from && amount > from.currentBalance)
      return toast.error(`"${from.accountName}" has only ${money(from.currentBalance)}.`);

    try {
      await mutation.mutateAsync({
        fromAccountId: form.fromAccountId,
        toAccountId: form.toAccountId,
        amount,
        transferDate: form.transferDate,
        note: form.note || undefined,
      });
      toast.success("Transfer completed.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Transfer failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogDescription>
            Move money between your accounts. The full amount arrives, no fee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              From account
              <Select
                value={form.fromAccountId}
                onValueChange={(v) => setForm({ ...form, fromAccountId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.accountName} ({money(a.currentBalance)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              To account
              <Select
                value={form.toAccountId}
                onValueChange={(v) => setForm({ ...form, toAccountId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((a) => a._id !== form.fromAccountId)
                    .map((a) => (
                      <SelectItem key={a._id} value={a._id}>
                        {a.accountName} ({money(a.currentBalance)})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
              Date
              <Input
                type="date"
                value={form.transferDate}
                onChange={(e) => setForm({ ...form, transferDate: e.target.value })}
                required
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            Note
            <Textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Optional note"
            />
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="cursor-pointer bg-indigo-600 text-white transition hover:scale-[1.02] hover:bg-indigo-500"
            >
              {mutation.isPending ? "Transferring..." : "Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TransferDialog;