"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useCreateLoan,
  useDeposit,
} from "@/features/financial-account/hooks/use-ledger";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const initial = {
  kind: "DEPOSIT" as "DEPOSIT" | "LOAN",
  accountId: "",
  amount: "",
  date: today(),
  note: "",
  lenderName: "",
  lenderPhone: "",
  dueDate: "",
};

export function AddMoneyDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState(initial);
  const deposit = useDeposit();
  const loan = useCreateLoan();
  const accountsQuery = useFinancialAccounts(
    { limit: 100, status: "ACTIVE" } as never,
    { enabled: open },
  );
  const accounts = accountsQuery.data?.data ?? [];
  const isPending = deposit.isPending || loan.isPending;

  useEffect(() => {
    if (open) setForm({ ...initial, date: today() });
  }, [open]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const amount = Number(form.amount);
    if (!form.accountId) return toast.error("Please select an account.");
    if (!(amount > 0)) return toast.error("Amount must be greater than 0.");
    if (!form.date) return toast.error("Please select a date.");

    try {
      if (form.kind === "DEPOSIT") {
        await deposit.mutateAsync({
          accountId: form.accountId,
          amount,
          date: form.date,
          note: form.note || undefined,
        });
        toast.success("Money added successfully.");
      } else {
        if (form.lenderName.trim().length < 2) {
          return toast.error("Lender name is required.");
        }
        await loan.mutateAsync({
          lenderName: form.lenderName.trim(),
          lenderPhone: form.lenderPhone || undefined,
          amount,
          accountId: form.accountId,
          receivedDate: form.date,
          dueDate: form.dueDate || null,
          note: form.note || undefined,
        });
        toast.success("Loan recorded and money added.");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Money</DialogTitle>
          <DialogDescription>
            Add your own money, or record borrowed money. Both increase the
            selected account balance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Type
            <Select
              value={form.kind}
              onValueChange={(v) =>
                setForm({ ...form, kind: v as "DEPOSIT" | "LOAN" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEPOSIT">Own money (Deposit)</SelectItem>
                <SelectItem value="LOAN">Borrowed money (Loan)</SelectItem>
              </SelectContent>
            </Select>
          </label>

          {form.kind === "LOAN" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Lender name
                <Input
                  value={form.lenderName}
                  onChange={(e) => setForm({ ...form, lenderName: e.target.value })}
                  placeholder="Who gave the money"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Lender phone
                <Input
                  value={form.lenderPhone}
                  onChange={(e) => setForm({ ...form, lenderPhone: e.target.value })}
                  placeholder="Optional"
                />
              </label>
            </div>
          )}

          <label className="grid gap-2 text-sm font-medium">
            Add to account
            <Select
              value={form.accountId}
              onValueChange={(v) => setForm({ ...form, accountId: v })}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={accountsQuery.isLoading ? "Loading..." : "Select account"}
                />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a._id} value={a._id}>
                    {a.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

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
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </label>
          </div>

          {form.kind === "LOAN" && (
            <label className="grid gap-2 text-sm font-medium">
              Repayment due date (optional)
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </label>
          )}

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
              disabled={isPending}
              className="cursor-pointer bg-indigo-600 text-white transition hover:scale-[1.02] hover:bg-indigo-500"
            >
              {isPending ? "Saving..." : form.kind === "LOAN" ? "Record Loan" : "Add Money"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddMoneyDialog;