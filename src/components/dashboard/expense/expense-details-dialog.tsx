"use client";

import type { ReactNode } from "react";
import { Calendar, ExternalLink, Landmark, Receipt, Tag, User } from "lucide-react";

import type { IExpense } from "@/types/expense.types";
import { formatDate } from "@/utils/dateFormat";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  accountNameOf,
  categoryNameOf,
  creatorName,
  formatMoney,
} from "@/components/dashboard/my-finance/finance-format";

interface ExpenseDetailsDialogProps {
  expense: IExpense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

function Field({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <div className="mt-1.5 text-sm font-medium">{children}</div>
    </div>
  );
}

/** Read-only view of one expense: amount, who recorded it, and the paying account. */
export function ExpenseDetailsDialog({ expense, open, onOpenChange }: ExpenseDetailsDialogProps) {
  const creator = expense?.createdBy && typeof expense.createdBy !== "string" ? expense.createdBy : null;
  const accountType =
    expense?.financialAccountId && typeof expense.financialAccountId !== "string"
      ? expense.financialAccountId.accountType?.replace(/_/g, " ")
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {expense && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                Expense details
              </DialogTitle>
              <DialogDescription>{formatDate(expense.expenseDate)}</DialogDescription>
            </DialogHeader>

            <div className="rounded-xl bg-gradient-to-br from-rose-50 to-white p-4 dark:from-rose-950/40 dark:to-transparent">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Amount</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                {formatMoney(expense.amount)}
              </p>
              <p className="mt-2 text-sm">{expense.description || "No description"}</p>
              {expense.reference && (
                <Badge variant="outline" className="mt-2">
                  Ref: {expense.reference}
                </Badge>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field icon={<Tag className="h-3.5 w-3.5" />} label="Category">
                {categoryNameOf(expense)}
              </Field>
              <Field icon={<Landmark className="h-3.5 w-3.5" />} label="Paid from">
                <div>{accountNameOf(expense)}</div>
                {accountType && <p className="text-xs font-normal text-muted-foreground">{accountType}</p>}
              </Field>
              <Field icon={<User className="h-3.5 w-3.5" />} label="Recorded by">
                <div>{creatorName(expense)}</div>
                {creator?.email && (
                  <p className="text-xs font-normal text-muted-foreground">{creator.email}</p>
                )}
                {creator?.role && (
                  <Badge variant="secondary" className="mt-1 text-[10px]">
                    {creator.role.replace(/_/g, " ")}
                  </Badge>
                )}
              </Field>
              <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Recorded on">
                <div>{formatDateTime(expense.createdAt)}</div>
                {expense.updatedAt && expense.updatedAt !== expense.createdAt && (
                  <p className="text-xs font-normal text-muted-foreground">
                    Updated {formatDateTime(expense.updatedAt)}
                  </p>
                )}
              </Field>
            </div>

            {expense.attachment && (
              <a
                href={expense.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <ExternalLink className="h-4 w-4" />
                View attachment
              </a>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseDetailsDialog;
